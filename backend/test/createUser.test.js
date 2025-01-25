// Import necessary modules and services
const { createUser } = require('../src/services/User.service');
const User = require('../src/model/User.model');
const emailService = require('../src/services/Email.service');
const crypto = require('crypto');

// Mock all dependencies to avoid real interactions with file system, database, or email services
jest.mock('../src/model/User.model');
jest.mock('../src/services/Email.service');

//Test Suite
describe('Create user.', () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('should create a new user with valid details', async () => {
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });
  
      emailService.sendEmail.mockResolvedValue(true);
  
      User.prototype.save = jest.fn().mockResolvedValue(true);
  
      const userInput = {
        fullname: 'Test User',
        email: 'testuser@example.com',
        role: 'user',
      };
  
      const result = await createUser(userInput);
  
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ email: userInput.email }, { username: userInput.email.split('@')[0] }],
      });
      expect(User.prototype.save).toHaveBeenCalled();
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        userInput.email,
        'Welcome to Kavach',
        expect.any(String)
      );
      expect(result).toEqual({
        success: true,
        message: 'User created successfully',
      });
    });
  
    test('should return error if user already exists', async () => {
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({ email: 'testuser@example.com' }),
      });
  
      const userInput = {
        fullname: 'Test User',
        email: 'testuser@example.com',
        role: 'user',
      };
  
      const result = await createUser(userInput);
  
      expect(User.findOne).toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        message: 'User already exists',
      });
    });
  
    test('should return error for invalid email', async () => {
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });
  
      emailService.sendEmail.mockRejectedValue(new Error('Invalid Email'));
  
      const userInput = {
        fullname: 'Test User',
        email: 'invalidemail',
        role: 'user',
      };
  
      const result = await createUser(userInput);
  
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        userInput.email,
        'Welcome to Kavach',
        expect.any(String)
      );
      expect(result).toEqual({
        success: false,
        message: 'Invalid Email. Please enter a valid email address',
      });
    });
  });