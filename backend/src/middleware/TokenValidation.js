const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.sendStatus(400);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err)
      if (
        err.name === "TokenExpiredError" ||
        err.name === "JsonWebTokenError"
      ) {
        req.session.destroy((err) => {
          if (err) {
            console.error("Error destroying session:", err);
            return res.sendStatus(500);
          }
          return res.sendStatus(403);
        });
      } else {
        return res.sendStatus(403);
      }
      return;
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
