const nodemailer = require("nodemailer");
const asyncHandler = require("../middleware/asyncHandler");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const adminReplyEmail = asyncHandler(async (userEmail, subject, content) => {

  const mailOptions = {
    from: "ADMINTRAVEL",
    to: userEmail,
    subject: `Trả lời cho câu hỏi ${subject}`,
    text: content,
  };

  await transporter.sendMail(mailOptions);
});
module.exports = { adminReplyEmail };
