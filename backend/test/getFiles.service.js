const File = require('../../src/model/File.model'); 

class FileService {
  static async getFilesByUser(userId) {
    try {
      const files = await File.find({ owner: userId }); // Fetch files by user ID
      return files;
    } catch (error) {
      throw new Error(error.message); 
    }
  }
}

module.exports = FileService;
