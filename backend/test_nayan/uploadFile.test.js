// Import necessary modules and services
const fs = require("fs"); 
const { uploadFile } = require("../src/services/File.service"); 
const File = require("../src/model/File.model");
const AES = require("../src/crypto/AES"); 
const SHA256 = require("../src/crypto/sha256"); 

// Mock all dependencies to avoid real interactions with file system, database, or cryptography
jest.mock("fs");
jest.mock("../src/model/File.model");
jest.mock("../src/crypto/AES");
jest.mock("../src/crypto/sha256");

//Test Suit
describe("Testing the uploadFile functionality", () => {
  let mockFile;
  let loggedInUser;

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.clearAllMocks();

    mockFile = {
      name: "testfile.txt",
      mimetype: "text/plain", 
      data: Buffer.from("This is a test file"), 
    };

    loggedInUser = {
      username: "testuser", 
      userId: "12345", 
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Uploads a file with encryption", async () => {
    const mockCipheredData = "encryptedData"; 
    const mockKey = "mockKey"; 
    const mockIv = "mockIv"; 

    AES.mockImplementation(() => ({
      AES_Encrypt: jest.fn(() => mockCipheredData), 
      key: mockKey, 
      iv: mockIv,
    }));

    
    fs.existsSync.mockReturnValue(false); 
    fs.mkdirSync.mockImplementation(() => {}); 
    fs.writeFile.mockImplementation((path, data, encoding, callback) => callback(null)); 

    File.prototype.save = jest.fn().mockResolvedValue(); 

    const result = await uploadFile(mockFile, "true", loggedInUser); 

    expect(result.fileData.encryptedKey).toBe(mockKey); 
    expect(result.fileData.iv).toBe(mockIv); 
    expect(result.fileData.filename).toBe(`${mockFile.name}.aes`); 
    expect(fs.mkdirSync).toHaveBeenCalledWith(`./uploads/${loggedInUser.username}`, { recursive: true }); 
    expect(fs.writeFile).toHaveBeenCalled(); 
    expect(File.prototype.save).toHaveBeenCalled(); 
  });

  test("Uploads a file without encryption", async () => {
    fs.existsSync.mockReturnValue(false); 
    fs.mkdirSync.mockImplementation(() => {}); 
    fs.writeFile.mockImplementation((path, data, encoding, callback) => callback(null)); 

    File.prototype.save = jest.fn().mockResolvedValue(); 

    const result = await uploadFile(mockFile, "false", loggedInUser); 

    expect(result).toBeUndefined(); 
    expect(fs.mkdirSync).toHaveBeenCalledWith(`./uploads/${loggedInUser.username}`, { recursive: true }); 
    expect(fs.writeFile).toHaveBeenCalled(); 
    expect(File.prototype.save).toHaveBeenCalled(); 
  });

  test("Fails to upload file due to missing directory path", async () => {
    fs.existsSync.mockReturnValue(false); 
    fs.mkdirSync.mockImplementation(() => {
      throw new Error("Missing path error"); 
    });

    const result = await uploadFile(mockFile, "true", loggedInUser); 

    expect(result).toEqual({
      success: false, 
      message: "An error occurred while uploading the file", 
    });
    expect(fs.mkdirSync).toHaveBeenCalledWith(`./uploads/${loggedInUser.username}`, { recursive: true }); 
  });
});
