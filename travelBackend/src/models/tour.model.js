const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    meetingPoint: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      ],
      default: [],
    },
    //lịch trình tour
    itinerary: {
      type: [
        {
          day: { type: Number, required: true },
          title: { type: String, required: true },
          description: { type: String, required: true },
        },
      ],
      default: [],
    },
    //bao gồm
    inclusions: {
      type: [String],
      default: [],
    },
    //không bao gồm
    exclusions: {
      type: [String],
      default: [],
    },
    startDates: {
      type: [Date],
      default: [],
    },
    totalSlots: {
      type: Number,
      required: true,
    },
    bookedSlots: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//kiểm tra số chỗ còn trống
tourSchema.virtual("availableSlots").get(function () {
  return this.totalSlots - this.bookedSlots;
});
//kiểm tra có giảm giá không
tourSchema.virtual("hasDiscount").get(function () {
  return this.discountPrice < this.price && this.discountPrice > 0;
});
//tính phần trăm giảm giá
tourSchema.virtual("discountPercentage").get(function () {
  if (this.hasDiscount) {
    return Math.round(
      ((this.price - this.discountPrice) / this.price) * 100
    ).toFixed(2);
  }
  return 0;
});
//kiểm tra tour còn trống và còn hoạt động không
tourSchema.virtual("isAvailable").get(function () {
  return this.availableSlots > 0 && this.isActive;
});
tourSchema.virtual("endDate").get(function () {
  return this.startDates.map((date) => {
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + this.duration);
    return endDate;
  });
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
