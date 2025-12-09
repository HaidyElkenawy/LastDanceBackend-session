const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // add fields here
  Email:{
    type: String,
    required: true,
    unique: true
  },
  Password:{
    type: String,
    required: true
  },
  Role:{
    type: String,
    enum: ['super-admin','admin', 'user'],
    default: 'user'
  },
  OTP:{
    type: String,
    maxlenghth: 6
  },
  OTPExpiry:{
    type: Date
  },
  isVerified:{
    type: Boolean,
    default: false
  }

});

module.exports = mongoose.model("User", UserSchema);
