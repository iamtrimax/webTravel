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
    // Thêm trường rating
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      },
      details: {
        type: [
          {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
              required: true
            },
            rating: {
              type: Number,
              required: true,
              min: 1,
              max: 5
            },
            comment: {
              type: String,
              default: ''
            },
            createdAt: {
              type: Date,
              default: Date.now
            }
          }
        ],
        default: []
      }
    }
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
  if (!this.startDates || this.startDates.length === 0) return [];
  
  return this.startDates.map((date) => {
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + this.duration);
    return endDate;
  });
});

// Virtual để lấy số sao làm tròn (dùng cho hiển thị)
tourSchema.virtual("roundedRating").get(function () {
  return Math.round(this.rating.average * 2) / 2; // Làm tròn đến 0.5
});

// Virtual để lấy số sao đầy đủ (dùng cho tính toán)
tourSchema.virtual("fullStars").get(function () {
  return Math.floor(this.rating.average);
});

// Virtual để kiểm tra có rating không
tourSchema.virtual("hasRatings").get(function () {
  return this.rating.count > 0;
});

// Method để thêm rating mới
tourSchema.methods.addRating = function(userId, ratingValue, comment = '') {
  // Kiểm tra user đã rating chưa
  const existingRatingIndex = this.rating.details.findIndex(
    detail => detail.userId.toString() === userId.toString()
  );

  if (existingRatingIndex !== -1) {
    // Cập nhật rating cũ
    const oldRating = this.rating.details[existingRatingIndex].rating;
    this.rating.details[existingRatingIndex].rating = ratingValue;
    this.rating.details[existingRatingIndex].comment = comment;
    this.rating.details[existingRatingIndex].createdAt = new Date();
    this.rating.count+=0
    // Cập nhật average rating
    this.rating.average = ((this.rating.average * this.rating.count) - oldRating + ratingValue) / this.rating.count;
  } else {
    // Thêm rating mới
    this.rating.details.push({
      userId,
      rating: ratingValue,
      comment,
      createdAt: new Date()
    });
    
    // Cập nhật average rating và count
    this.rating.average = ((this.rating.average * this.rating.count) + ratingValue) / (this.rating.count + 1);
    this.rating.count += 1;
  }

  // Làm tròn average rating đến 1 chữ số thập phân
  this.rating.average = Math.round(this.rating.average * 10) / 10;
};

// Method để xóa rating
tourSchema.methods.removeRating = function(userId) {
  const ratingIndex = this.rating.details.findIndex(
    detail => detail.userId.toString() === userId.toString()
  );

  if (ratingIndex !== -1) {
    const removedRating = this.rating.details[ratingIndex].rating;
    
    // Xóa rating
    this.rating.details.splice(ratingIndex, 1);
    
    // Cập nhật average rating và count
    if (this.rating.count > 1) {
      this.rating.average = ((this.rating.average * this.rating.count) - removedRating) / (this.rating.count - 1);
      this.rating.count -= 1;
    } else {
      this.rating.average = 0;
      this.rating.count = 0;
    }

    // Làm tròn average rating đến 1 chữ số thập phân
    this.rating.average = Math.round(this.rating.average * 10) / 10;
  }
};

// Method để lấy rating của user cụ thể
tourSchema.methods.getUserRating = function(userId) {
  return this.rating.details.find(
    detail => detail.userId.toString() === userId.toString()
  );
};

// Static method để lấy tours có rating cao nhất
tourSchema.statics.getTopRated = function(limit = 10) {
  return this.find({ 
    'rating.count': { $gt: 0 },
    'rating.average': { $gte: 4.0 },
    'isActive':{$ne:false}
  })
  .sort({ 'rating.average': -1, 'rating.count': -1 })
  .limit(limit);
};

// Static method để lấy tours mới có rating tốt
tourSchema.statics.getNewAndPopular = function(limit = 10) {
  return this.find({ 
    'rating.count': { $gt: 0 }
  })
  .sort({ createdAt: -1, 'rating.average': -1 })
  .limit(limit);
};

// Middleware để tự động cập nhật rating khi có thay đổi
tourSchema.pre('save', function(next) {
  // Đảm bảo rating nằm trong khoảng 0-5
  if (this.rating.average < 0) this.rating.average = 0;
  if (this.rating.average > 5) this.rating.average = 5;
  
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;