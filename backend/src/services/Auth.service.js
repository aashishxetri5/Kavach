const User = require("../model/User.model.js");
const SHA256 = require("../crypto/sha256");

exports.validateCredentails = async (email, password) => {
  const user = await User.findOne({ email }).lean();

  if (!user) {
    return undefined;
  }

  const sha256 = new SHA256();
  const hashedPassword = sha256.hash(password);

  const isMatch = compare(hashedPassword, user.passwordHash);

  if (!isMatch) {
    return undefined;
  } else {
    delete user.passwordHash;
    return user;
  }
};

function compare(hashedPassword, password) {
  if (password === hashedPassword) {
    return true;
  }
  return false;
}
