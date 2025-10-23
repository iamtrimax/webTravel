const nodemailer = require("nodemailer");
const asyncHandler = require("../middleware/asyncHandler");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const adminReplyEmail = async (userEmail, subject, content) => {
  const mailOptions = {
    from: "ADMINTRAVEL",
    to: userEmail,
    subject: `Trả lời cho câu hỏi ${subject}`,
    text: content,
  };

  await transporter.sendMail(mailOptions);
};
const mailAutoCancelBooking = async (userEmail, bookingId, cancelDate) => {
  const mailOptions = {
    from: "ADMINTRAVEL",
    to: userEmail,
    subject: `Thông báo huỷ đặt tour ${bookingId}`,
    html: `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9fafb;
        padding: 20px;
        border-radius: 10px;
        max-width: 600px;
        margin: auto;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      ">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" width="80" alt="Cancel Icon" />
          <h2 style="color: #e74c3c;">Đơn đặt tour của bạn đã bị hủy</h2>
        </div>

        <p style="font-size: 16px; color: #333;">
          Xin chào,<br>
          Đơn đặt tour của bạn với mã <strong style="color:#2563eb;">${bookingId}</strong> đã bị hủy do không hoàn tất thanh toán đúng hạn.
        </p>

        <div style="background-color: #fff; border-radius: 8px; padding: 15px; margin-top: 10px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #555;">Mã đặt tour:</td>
              <td style="padding: 8px 0; font-weight: 600;">${bookingId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;">Ngày hủy:</td>
              <td style="padding: 8px 0;">${new Date(
                cancelDate
              ).toLocaleDateString("vi-VN")}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 15px; color: #333; margin-top: 20px;">
          Nếu bạn vẫn muốn tham gia tour này, vui lòng đặt lại hoặc liên hệ đội ngũ hỗ trợ của chúng tôi để được giúp đỡ.
        </p>

        <div style="margin-top: 25px; text-align: center;">
          <a href="https://yourtravelwebsite.com" style="
            background-color: #2563eb;
            color: #fff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 6px;
            display: inline-block;
          ">Đặt lại tour</a>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="text-align: center; font-size: 13px; color: #888;">
          Cảm ơn bạn đã sử dụng dịch vụ của <strong>TravelBooking</strong>.<br>
          Hotline hỗ trợ: <a href="tel:+84123456789" style="color:#2563eb;">0123 456 789</a> — Email: support@travelapp.com
        </p>
      </div>
    `,
  };
  console.log("email: ", userEmail);
  await transporter.sendMail(mailOptions);
};
const mailPayConfirm = async (
  email,
  bookingId,
  username,
  totalPrice,
  createdAt
) => {
  console.log("mailPayConfirm args:", {
    email,
    bookingId,
    username,
    totalPrice,
    createdAt,
  });
  const mailOptions = {
    from: "ADMINTRAVEL", // Người gửi
    to: email, // Người nhận
    subject: "✅ Xác nhận chuyển khoản", // Tiêu đề
    html: `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận chuyển khoản</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
      .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee; }
      .header h1 { color: #4CAF50; }
      .content { padding: 20px 0; line-height: 1.6; }
      .details { background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; }
      .details p { margin: 5px 0; }
      .footer { text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 15px; }
      .btn { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; border-radius: 5px; text-decoration: none; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>✅ Xác nhận chuyển khoản</h1>
      </div>
      <div class="content">
        <p>Chào <strong>${username}</strong>,</p>
         <p>Mã đơn <strong style="color:#2563eb;">${bookingId}</strong></p>
        <p>Chúng tôi đã nhận được chuyển khoản của bạn thành công. Thông tin chi tiết như sau:</p>
        <div class="details">
          <p><strong>Số tiền:</strong> ${
            new Intl.NumberFormat("vi-VN").format(totalPrice) + " VND"
          }</p>
          <p><strong>Ngày chuyển khoản:</strong> ${new Date(
            createdAt
          ).toLocaleDateString("vi-VN")}</p>
        </div>
        <p>Bạn có thể xem chi tiết hoặc quản lý giao dịch của mình bằng cách nhấn nút dưới đây:</p>
        <p style="text-align:center;">
          <a href="https://example.com/transactions/123456789" class="btn">Xem chi tiết</a>
        </p>
        <p>Xin cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      </div>
      <div class="footer">
        © 2025 Công ty Du Lịch. Bảo lưu mọi quyền.
      </div>
    </div>
  </body>
  </html>
  `,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { adminReplyEmail, mailAutoCancelBooking, mailPayConfirm };
