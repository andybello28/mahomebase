// Run with: node benchmark.js
// Requires DB_URL and REDIS_URL in backend/.env pointing to live services
require("dotenv").config();

const prisma = require("./db/prisma");
const client = require("./redis/client");

const RUNS = 50;
const TEST_KEY = "benchmark:league:test";

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

async function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

async function run() {
  console.log("\n=== Mahomebase Redis vs PostgreSQL Latency Benchmark ===\n");

  // 1. Find a real league_id to benchmark against
  const league = await prisma.league.findFirst();
  if (!league) {
    console.error("No leagues found in DB. Link a league first.");
    process.exit(1);
  }
  const league_id = league.league_id;
  console.log(`Benchmarking league: ${league.name} (${league_id})\n`);

  // 2. Warm up connections
  await client.ping();
  await prisma.league.findUnique({ where: { league_id } });

  // 3. Benchmark cold PostgreSQL (cache bypassed)
  console.log(`Running ${RUNS} direct PostgreSQL queries...`);
  const pgTimes = [];
  for (let i = 0; i < RUNS; i++) {
    const start = performance.now();
    await prisma.league.findUnique({ where: { league_id } });
    pgTimes.push(performance.now() - start);
    await sleep(20); // avoid hammering
  }

  // 4. Seed Redis with the same data
  await client.set(TEST_KEY, JSON.stringify(league), { EX: 300 });

  // 5. Benchmark Redis cache hits
  console.log(`Running ${RUNS} Redis GET calls...\n`);
  const redisTimes = [];
  for (let i = 0; i < RUNS; i++) {
    const start = performance.now();
    const cached = await client.get(TEST_KEY);
    JSON.parse(cached); // include deserialization — this is what the real code does
    redisTimes.push(performance.now() - start);
    await sleep(20);
  }

  // 6. Report
  const pgAvg = await avg(pgTimes);
  const pgMed = await median(pgTimes);
  const pgMin = Math.min(...pgTimes);
  const pgMax = Math.max(...pgTimes);

  const redisAvg = await avg(redisTimes);
  const redisMed = await median(redisTimes);
  const redisMin = Math.min(...redisTimes);
  const redisMax = Math.max(...redisTimes);

  const speedup = pgAvg / redisAvg;
  const reduction = ((1 - redisAvg / pgAvg) * 100).toFixed(1);

  console.log("--- PostgreSQL (cache miss) ---");
  console.log(`  avg:    ${pgAvg.toFixed(2)}ms`);
  console.log(`  median: ${pgMed.toFixed(2)}ms`);
  console.log(`  min:    ${pgMin.toFixed(2)}ms`);
  console.log(`  max:    ${pgMax.toFixed(2)}ms`);

  console.log("\n--- Redis (cache hit) ---");
  console.log(`  avg:    ${redisAvg.toFixed(2)}ms`);
  console.log(`  median: ${redisMed.toFixed(2)}ms`);
  console.log(`  min:    ${redisMin.toFixed(2)}ms`);
  console.log(`  max:    ${redisMax.toFixed(2)}ms`);

  console.log("\n--- Result ---");
  console.log(`  Redis is ${speedup.toFixed(1)}x faster than PostgreSQL`);
  console.log(`  Latency reduced by ${reduction}% on cache hits`);
  console.log(
    `\n  Resume line:\n  "Reduced average API response time from ${pgAvg.toFixed(0)}ms to ${redisAvg.toFixed(0)}ms using Redis caching of league and user data"`
  );

  // Cleanup
  await client.del(TEST_KEY);
  await prisma.$disconnect();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
