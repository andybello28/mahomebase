const { validationResult } = require("express-validator");

// Helper to run validators against a mock request
async function runValidators(validators, req) {
  for (const validator of validators) {
    await validator.run(req);
  }
  return validationResult(req);
}

function mockReq({ body = {}, params = {} } = {}) {
  return { body, params };
}

describe("leagueValidator", () => {
  const leagueValidator = require("../validators/leagueValidator");

  test("passes with a valid numeric league ID", async () => {
    const req = mockReq({ params: { leagueid: "123456789" } });
    const result = await runValidators(leagueValidator, req);
    expect(result.isEmpty()).toBe(true);
  });

  test("fails with a non-numeric league ID", async () => {
    const req = mockReq({ params: { leagueid: "abc123" } });
    const result = await runValidators(leagueValidator, req);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()[0].msg).toBe("Sleeper league ID's must contain strictly digits");
  });

  test("fails with an empty league ID", async () => {
    const req = mockReq({ params: { leagueid: "" } });
    const result = await runValidators(leagueValidator, req);
    expect(result.isEmpty()).toBe(false);
  });
});

describe("sleeperValidator", () => {
  const validateSleeper = require("../validators/sleeperValidator");

  test("passes with a valid username", async () => {
    const req = mockReq({ body: { sleeper_username: "mahomes15" } });
    const result = await runValidators(validateSleeper, req);
    expect(result.isEmpty()).toBe(true);
  });

  test("passes and trims whitespace from username", async () => {
    const req = mockReq({ body: { sleeper_username: "  mahomes15  " } });
    const result = await runValidators(validateSleeper, req);
    expect(result.isEmpty()).toBe(true);
  });
});
