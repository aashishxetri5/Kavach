const authService = require("../services/Auth.service.js");

exports.validateLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await authService.validateCredentails(email, password);

  if (user === undefined) {
    req.flash({ error: "Invalid Email or Password" });
    res.redirect("/login");
    return;
  }

  req.session.loggedInUser = user;
  console.log(req.session.loggedInUser);
  
  req.flash({ success: "Logged in successfully" });
  res.redirect("/my-storage");
};
