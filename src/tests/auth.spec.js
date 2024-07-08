// tests/auth.spec.js
const request = require("supertest");
const app = require("../server");
const { PrismaClient } = require("../prisma/client");
const prisma = new PrismaClient();

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.organisation.deleteMany();
  }, 50000);

  afterAll(async () => {
    await prisma.$disconnect();
    app.close();
  }, 50000);

  describe("POST /auth/register", () => {
    it("should register user successfully with default organisation", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phone: "1234567890",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.firstName).toBe(userData.firstName);
      expect(response.body.data.user.lastName).toBe(userData.lastName);
      expect(response.body.data.user.phone).toBe(userData.phone);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it("should fail if required fields are missing", async () => {
      const response = await request(app).post("/api/auth/register").send({
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(response.status).toBe(422);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail if there's duplicate email", async () => {
      const userData = {
        firstName: "Jane",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phone: "1234567890",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData);
      expect(response.status).toBe(422);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("POST /auth/login", () => {
    it("should log the user in successfully", async () => {
      const loginData = {
        email: "john.doe@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it("should fail with incorrect credentials", async () => {
      const loginData = {
        email: "john.doe@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Authentication failed");
    });
  });
});
