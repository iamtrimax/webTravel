const { required } = require("joi");
const { unix } = require("moment");
const mongoose = require("mongoose");

const booking = new mongoose.Schema(
  {
    idBooking: {
      type: String,
      unique: true,
    },
    bookingSlots: {
      type: Number,
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    totalPrice:{
        type:Number
    },
    fullname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email:{
        type:String,
        required:true
    },
    address: {
      type: String,
      required: true,
    },

    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
    },
    payStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    specialRequire: {
      type: String,
    },
    cancelDate: {
      type: Date,
    },
    cancelReason: {
      type: String,
      default: "",
    },
    adminMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const bookingModel = mongoose.model("Booking", booking);
module.exports = bookingModel;
