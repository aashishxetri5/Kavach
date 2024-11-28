const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendEmail = async (to, subject, body) => {
  const mailOptions = {
    from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL_ADDRESS}>`, // sender address
    to,
    subject,
    html: body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
