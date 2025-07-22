const { createClient } = require("redis");
require("dotenv").config();

const client = createClient({
  username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    host: "redis-19943.c11.us-east-1-3.ec2.redns.redis-cloud.com",
    port: 19943,
  },
});

client.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  if (!client.isOpen) {
    await client.connect();
  }
})();

module.exports = client;
