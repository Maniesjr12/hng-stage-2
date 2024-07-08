// tests/token.spec.js
const { generateToken, verifyToken } = require("../utils/jwt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

describe("Token Generation", () => {
  it("should generate a token with correct user details", () => {
    const user = { userId: "123", email: "test@example.com" };
    const token = generateToken(user);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    expect(decoded.userId).toBe(user.userId);
    expect(decoded.email).toBe(user.email);
  });

  it("should expire the token after 1 hour", () => {
    const user = { userId: "123", email: "test@example.com" };
    const token = generateToken(user);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const expiryTime = decoded.exp * 1000;
    const currentTime = Date.now();
    expect(expiryTime - currentTime).toBeLessThanOrEqual(3600000); // 1 hour in milliseconds
  });
});
