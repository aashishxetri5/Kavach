module.exports = function (req, res, next) {
  res.set("Cache-Control", "no-store");
  next();
};
