const mongoose = require("mongoose");
//  id: 1,
//         userId: 'USR001',
//         userName: 'Nguyễn Văn A',
//         userEmail: 'nguyenvana@email.com',
//         subject: 'Hỏi về tour Đà Nẵng',
//         content: 'Tôi muốn hỏi về lịch trình tour Đà Nẵng 4 ngày 3 đêm...',
//         timestamp: '2024-01-15 14:30',
//         isRead: false,
//         isReplied: false,
//         priority: 'high'
const emailModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subject: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["high", "low", "medium"],
      default: "medium",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
module.exports = mongoose.model("Email", emailModel)
