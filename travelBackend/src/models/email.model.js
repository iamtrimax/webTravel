const mongoose = require("mongoose");
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
