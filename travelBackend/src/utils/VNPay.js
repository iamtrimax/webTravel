const { VNPay, dateFormat} = require("vnpay");
const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMNCODE, // Mã website của bạn
  secureSecret: process.env.VNP_HASHSECRET, // Chuỗi bí mật
  vnpayHost: process.env.VNP_URL, // hoặc production
  hashAlgorithm: 'SHA512', 
  testMode: true,
  enableLog: true,
});
module.exports = {vnpay, dateFormat}