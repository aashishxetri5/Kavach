const request = require("supertest");
const app = require("../app"); // Path to your Express app
const authService = require("../src/services/Auth.service");

// Mocking the dependencies
jest.mock("../src/services/Auth.service");


describe("POST /api/auth/login", () => {
  it("should login successfully and return a token", async () => {
    authService.validateUserCredentials.mockResolvedValue({
      success: true,
      token: "mockJWTToken",
      userId: "123",
    });
    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "asdf", // This should match your hashed password logic
    });

    expect(response.status).toBe(200);
    expect(response.body.result).toHaveProperty("token", "mockJWTToken");
  });

  it("should fail login with invalid credentials", async () => {
    authService.validateUserCredentials.mockResolvedValue({
      success: false,
      message: "Invalid credentials",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "invalid@example.com",
      password: "wrongpassword",
    });

    // expect(response.status).toBe(401);
    expect(response.body.result).toHaveProperty(
      "message",
      "Invalid credentials"
    );
  });

  it("should fail login with an invalid email format", async () => {
    authService.validateUserCredentials.mockResolvedValue({
      success: false,
      message: "Invalid email",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "invalid-email-format", // Invalid email
      password: "password",
    });

    //expect(response.status).toBe(400); // Bad request status code
    expect(response.body.result).toHaveProperty("message", "Invalid email");
  });
});
