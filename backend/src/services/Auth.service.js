const jwt = require("jsonwebtoken");
const crypto = require("crypto");
var randomWords = require("random-words");

const User = require("../model/User.model");
const File = require("../model/File.model");
const Phrase = require("../model/Phrase.model");

const { logActivity } = require("../services/Activity.service");
const { logMessages } = require("../utils/LogMessages.util");

const SHA256 = require("../crypto/sha256");
const emailService = require("../services/Email.service");

const validateUserCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ email }).select(
      "name username profilePic role password"
    );

    if (!user) {
      return { success: false, message: "Invalid email!! User doesn't exist." };
    }

    // Hash password
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // Compare password
    if (user.password !== hashedPassword) {
      return { success: false, message: "Invalid password" };
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        profile: user.profilePic,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const message = logMessages.login();
    logActivity(user._id, "Login", "", message);

    return { success: true, token, userId: user._id };
  } catch (error) {
    console.error("Error in validateUserCredentials:", error);
    return { success: false, message: "Something went wrong!! Try again." };
  }
};

const validatePhrase = async (phrase, userId) => {
  try {
    const userSentPhrase = new SHA256().hash(phrase);
    const phraseDoc = await Phrase.findOne({ userId })
      .sort({ createdAt: -1 })
      .select("phrase");

    if (phraseDoc.phrase === userSentPhrase) {
      return { success: true };
    } else {
      throw new Error("Invalid phrase!! Access Denied.");
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const sendPhraseToUser = async (userId, fileId) => {
  try {
    const phrase = randomWords({
      exactly: 1,
      wordsPerString: 3,
      separator: "-",
    });

    const hashedPhrase = new SHA256().hash(phrase[0]);

    const newPhrase = new Phrase({
      userId,
      fileId,
      phrase: hashedPhrase,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await newPhrase.save();

    const userEmail = await User.findById(userId).select("email");

    await emailService.sendEmail(
      userEmail.email,
      "Your secret phrase",
      `<p>Hi,</p>
      <p>We have received a request to download your file: ${(
        await File.findById(fileId).select("filename")
      ).filename.replace(
        ".aes",
        ""
      )}. To proceed, please verify your identity by entering the following secret phrase:</p>

      <p>Your secret phrase is: <b>${phrase}</b></p>

      <p>This phrase will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>

      <p>Thanks,</p>
      `
    );

    return { success: true };
  } catch (error) {
    console.error("Error in sendPhraseToUser:", error);
    return { success: false, message: "Something went wrong!! Try again." };
  }
};

module.exports = { validateUserCredentials, validatePhrase, sendPhraseToUser };
