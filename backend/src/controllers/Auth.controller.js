const authService = require("../services/Auth.service");

const { logActivity } = require("../services/Activity.service");
const { logMessages } = require("../utils/LogMessages.util");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { userId, ...result } = await authService.validateUserCredentials(
      email,
      password
    );
    res.status(200).json({ result: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send({ title: "Server Error" });
      }

      const message = logMessages.logout(req.user.username);
      logActivity(req.user.userId, "logged out", "", message);
      
      return res.sendStatus(200);
    });
  } catch (error) {
    res.status(400).json({ result: error.message });
  }
};

const validatePhrase = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { phrase } = req.body;

    const result = await authService.validatePhrase(phrase, userId);

    if (result.success) {
      res.status(200).json({ result });
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const sendPhrase = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fileId } = req.body;

    const result = await authService.sendPhraseToUser(userId, fileId);

    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { login, logout, sendPhrase, validatePhrase };
