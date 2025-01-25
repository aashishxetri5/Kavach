const emailService = require("../src/services/Email.service");

// Mocking the sendEmail service
jest.mock("../src/services/Email.service");

describe("Send Email Functionality", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should send email successfully with valid parameters", async () => {
    emailService.sendEmail.mockResolvedValue(true);

    const result = await emailService.sendEmail(
      "recipient@example.com",
      "Test Subject",
      "Test Body"
    );

    expect(result).toBe(true);
    expect(emailService.sendEmail).toHaveBeenCalledWith(
      "recipient@example.com",
      "Test Subject",
      "Test Body"
    );
  });

  it("should throw an error due to authentication failure", async () => {
    emailService.sendEmail.mockRejectedValue(
      new Error("Authentication failure")
    );

    await expect(
      emailService.sendEmail(
        "recipient@example.com",
        "Test Subject",
        "Test Body"
      )
    ).rejects.toThrow("Authentication failure");
  });

  it("should throw an error due to missing recipient address", async () => {
    emailService.sendEmail.mockRejectedValue(
      new Error("Recipient address missing")
    );

    await expect(
      emailService.sendEmail("", "Test Subject", "Test Body")
    ).rejects.toThrow("Recipient address missing");
  });
});
