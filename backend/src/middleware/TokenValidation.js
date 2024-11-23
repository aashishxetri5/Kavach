const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.sendStatus(400);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      let status;
      if (err.name === "TokenExpiredError") {
        req.session.destroy((err) => {
          if (err) {
            console.error("Error destroying session:", err);
            status = 500
          }
          status = 403;
        });
      }  else {
        status = 403;
      }
      return res.sendStatus(status);
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
