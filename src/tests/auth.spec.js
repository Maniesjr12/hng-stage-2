const request = require("supertest");
const app = require("../server");

describe("Auth API", () => {
  it("should register user successfully", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.user).toHaveProperty("userId");
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "John",
      email: "john.doe@example.com",
    });

    expect(res.statusCode).toEqual(422);
    expect(res.body.errors).toBeInstanceOf(Array);
  });

  it("should fail if there’s duplicate email", async () => {
    await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    const res = await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "0987654321",
    });

    expect(res.statusCode).toEqual(422);
    expect(res.body.errors).toBeInstanceOf(Array);
  });

  it("should log the user in successfully", async () => {
    await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    const res = await request(app).post("/auth/login").send({
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("accessToken");
  });
});
