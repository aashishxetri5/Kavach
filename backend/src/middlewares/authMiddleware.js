module.exports = function (req, res, next) {
  if (req.session.loggedInUser) {
    next();
  } else {
    res.redirect("/login");
  }
};

