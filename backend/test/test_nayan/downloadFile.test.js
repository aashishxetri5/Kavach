// Import necessary modules and services
const fs = require("fs");
const File = require("../src/model/File.model");
const AES = require("../src/crypto/AES");
const { downloadFile } = require("../src/services/File.service");

// Mock all dependencies to avoid real interactions with file system, database, or cryptography
jest.mock("fs");
jest.mock("../src/model/File.model");
jest.mock("../src/crypto/AES");

//Test Suite
describe("Download functionality tests", () => {
  const loggedInUser = { userId: "12345" };

  afterEach(() => jest.clearAllMocks());

  test("Downloads a file successfully when the user owns it", async () => {
    const fileMock = {
      _id: "fileId1",
      owner: loggedInUser.userId,
      filePath: "/path/to/file",
      filename: "testfile.aes",
      encryptedKey: "mockKey",
      iv: "mockIv",
    };

    const decryptedData = "Decrypted file content";
    File.findById.mockResolvedValue(fileMock);
    fs.readFileSync.mockReturnValue(Buffer.from("mockEncryptedData"));
    AES.mockImplementation(() => ({
      AES_Decrypt: jest.fn().mockReturnValue(decryptedData),
    }));

    const result = await downloadFile(fileMock._id, loggedInUser);

    expect(result).toEqual({
      data: Buffer.from(decryptedData, "hex"),
      fileName: fileMock.filename,
    });
    expect(File.findById).toHaveBeenCalledWith(fileMock._id);
    expect(fs.readFileSync).toHaveBeenCalledWith(
      `${fileMock.filePath}/${fileMock.filename}`
    );
  });

  test("Returns an error when the user tries to access someone else's file", async () => {
    const fileMock = {
      _id: "fileId2",
      owner: "anotherUserId",
      filePath: "/path/to/file",
      filename: "testfile.aes",
    };

    File.findById.mockResolvedValue(fileMock);

    const result = await downloadFile(fileMock._id, loggedInUser);

    expect(result).toBeUndefined();
    expect(File.findById).toHaveBeenCalledWith(fileMock._id);
    expect(fs.readFileSync).not.toHaveBeenCalled();
  });

  test("Returns an error when the file does not exist", async () => {
    File.findById.mockResolvedValue(null);

    const result = await downloadFile("nonexistentFileId", loggedInUser);

    expect(result).toEqual({
      success: false,
      message: "File not found",
    });
    expect(File.findById).toHaveBeenCalledWith("nonexistentFileId");
    expect(fs.readFileSync).not.toHaveBeenCalled();
  });
});

