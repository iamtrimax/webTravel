const { vnpay, dateFormat } = require("./VNPay");

const paymentReturn = async (booking, refundPer, refundAmount) => {
  await vnpay.refund({
    vnp_Amount: refundAmount *100,
    vnp_CreateBy: booking.fullname,
    vnp_CreateDate: dateFormat(new Date()),
    vnp_IpAddr: "127.0.0.1",
    vnp_OrderInfo: `Hoan tien don dat tour ${booking.idBooking} ${refundPer}% so tien da dat`,
    vnp_RequestId: booking.idBooking,
    vnp_TransactionDate: dateFormat(new Date(booking.createdAt)),
    vnp_TxnRef: booking.idBooking,
    vnp_Locale: "vn"
  });
};
module.exports = {paymentReturn}
