const User = require("../model/User.model.js");
const SHA256 = require("../crypto/sha256");

exports.validateCredentails = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const sha256 = new SHA256();
  const hashedPassword = sha256.hash(password);

  const isMatch = compare(hashedPassword, user.passwordHash);
  console.log("match", isMatch);

  if (!isMatch) {
    return undefined;
  } else {
    return user;
  }
};

function compare(hashedPassword, password) {

  if (password === hashedPassword) {
    return true;
  }
  return false;
}
