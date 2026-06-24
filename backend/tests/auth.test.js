const request = require("supertest");
const express = require("express");

// Minimal express app that mirrors the auth routes we care about
function buildApp() {
  const app = express();
  app.use(express.json());

  // Mock session + passport so we can test route shape without a real DB
  app.use((req, _res, next) => {
    req.user = null;
    req.isAuthenticated = () => false;
    next();
  });

  app.get("/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    return res.status(401).json({ error: "Not authenticated" });
  });

  return app;
}

describe("GET /auth/user", () => {
  let app;

  beforeAll(() => {
    app = buildApp();
  });

  test("returns 401 when not authenticated", async () => {
    const res = await request(app).get("/auth/user");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authenticated");
  });

  test("returns user object when authenticated", async () => {
    const authenticatedApp = express();
    authenticatedApp.use(express.json());
    authenticatedApp.use((req, _res, next) => {
      req.user = { google_id: "123", email: "test@test.com", name: "Test User" };
      req.isAuthenticated = () => true;
      next();
    });
    authenticatedApp.get("/auth/user", (req, res) => {
      if (req.isAuthenticated()) return res.json(req.user);
      return res.status(401).json({ error: "Not authenticated" });
    });

    const res = await request(authenticatedApp).get("/auth/user");
    expect(res.status).toBe(200);
    expect(res.body.email).toBe("test@test.com");
  });
});
