// tests/organization.spec.js
const request = require("supertest");
const app = require("../server");
const { generateToken } = require("../utils/jwt");
const { PrismaClient } = require("../prisma/client");
const prisma = new PrismaClient();

describe("Organization Access Control", () => {
  let token, userId, orgId;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password",
      },
    });

    userId = Number(user.userId);
    token = generateToken(user);

    const org = await prisma.organisation.create({
      data: {
        name: "John's Organisation",
        users: {
          connect: { userId: user.userId },
        },
      },
    });

    orgId = org.orgId;
  }, 50000);

  afterAll(async () => {
    await prisma.$disconnect();
    app.close();
  }, 50000);

  it("should not allow users to see data from organizations they don't have access to", async () => {
    const otherUser = await prisma.user.create({
      data: {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: "password",
      },
    });

    const otherToken = generateToken(otherUser);

    const response = await request(app)
      .get(`/api/organisations/${orgId}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Organisation not found");
  });
});
