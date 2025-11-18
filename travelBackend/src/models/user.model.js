const mongoose = require('mongoose');
const emailModel = require('./email.model');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['user', 'admin'], default: "user"
    },
    isActive:{
        type: Boolean,
        default: true
    },
    refreshToken: {
        type: String,
        
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const user = await this.model.findOne(this.getFilter());
    if (user) {
      await emailModel.deleteMany({ userId: user._id });
    }
    next();
  } catch (err) {
    next(err);
  }
});
module.exports = mongoose.model('User', userSchema);