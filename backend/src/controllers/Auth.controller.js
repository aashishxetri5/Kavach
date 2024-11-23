const authService = require("../services/Auth.service");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { userId, ...result } = await authService.validateUserCredentials(
      email,
      password,
      req.session.userId
    );

    if (userId) {
      req.session.userId = userId;
    }
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
      return res.sendStatus(200);
    });
  } catch (error) {
    res.status(400).json({ result: error.message });
  }
};

module.exports = { login, logout };
