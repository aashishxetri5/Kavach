const authService = require("../services/Auth.service.js");

exports.validateLogin = async (req, res, next) => {
  const { email, password } = req.body;

  console.log(email, password)

  const user = authService.validateCredentails(email, password);
  if (user !== undefined) {
    console.log("User is valid");
  } else {
    console.log("User is invalid");
  }
};
