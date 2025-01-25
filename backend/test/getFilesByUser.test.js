// Import necessary modules and services
const FileService = require('./getFiles.service.js');
const File = require('../../src/model/File.model.js');

// Mock all dependencies to avoid real interactions with file system, database.
jest.mock('../src/model/File.model', () => ({
  find: jest.fn().mockImplementation(() => ({
    select: jest.fn().mockResolvedValue([]), 
  })),
}));

//Test Suite
describe('Get Files By User', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('retrieves all files for a user with correct metadata', async () => {
    const userId = '12345';
    const mockFiles = [
      { name: 'file1.txt', owner: userId },
      { name: 'file2.txt', owner: userId },
    ];

    File.find.mockResolvedValue(mockFiles); // Mock successful file retrieval

    const files = await FileService.getFilesByUser(userId);

    expect(files).toEqual(mockFiles); // Verify the result
    expect(File.find).toHaveBeenCalledWith({ owner: userId }); // Ensure correct query
  });
    
  
    it('handles errors gracefully when fetching files fails', async () => {
      const userId = '12345';
      const errorMessage = 'Database error';
  
      File.find.mockRejectedValue(new Error(errorMessage)); 
  
      await expect(FileService.getFilesByUser(userId)).rejects.toThrow(errorMessage); 
      expect(File.find).toHaveBeenCalledWith({ owner: userId }); 
    });
  });

