const authService = require("../service/Auth.service");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.validateUserCredentials(email, password);
    res.status(200).json({"result": result});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { login };
