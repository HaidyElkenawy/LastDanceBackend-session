const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { registerSchema , loginSchema } = require("../validation/userval");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
// FIX 1: Use require instead of import
// Note: Ensure your sendEmail.js file uses 'module.exports = sendMail'
const sendMail = require("../utils/sendEmail"); 

exports.register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.details.map((e) => e.message) });
    }

    const { Email, Password } = value;

    const userexists = await User.findOne({ Email});
    if (userexists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password, 12);
    
    // Using Math.random is okay, but crypto is more secure (optional)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpires = Date.now() + 100 * 60 * 1000;

    const user = await User.create({
     Email, Password: hashedPassword, OTP:  otp, OTPExpiry: otpExpires 
    });
    // FIX 3: Add 'await' here so we catch email errors
    try {
      await sendMail({
        to: Email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It will expire in 100 minutes.`
      });
    } catch (emailError) {
      // If email fails, we shouldn't register the user
      console.log("Email failed to send:", emailError);
      return res.status(500).json({ message: "Error sending email. Try again." });
    }

    
    console.log(`🔑 YOUR 6-DIGIT OTP IS: ${otp}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
    next(err);
  }
};


exports.verifyOtp = async (req, res, next) => {
  try {
    const { Email, OTP } = req.body;  
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.OTP !== OTP || user.OTPExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.OTP = null;
    user.OTPExpiry = null;
    user.isVerified = true;
    await user.save();
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
    next(err);
  }
};

exports.login = async (req, res, next) => {
  // add login logic here
  try{
    const{error,value}=loginSchema.validate(req.body,{abortEarly:false});
    if (error) {
      return res.status(400).json({ message: error.details.map((e) => e.message) });
    }
    const { Email, Password } = value;
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email credentials" });
    }
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password credentials" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify your email."  , isverified: false , email: user.Email});
    }
    const token = jwt.sign({ id: user._id  , role: user.Role}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.status(200).json({ token });

  }
  catch(err){
    console.log(err);
    res.status(500).json({ message: "Server Error" });
    next(err);
  }
};

exports.resendOtp = async (req, res, next) => {
  try {
    const { Email } = req.body;  
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    } 
    if(user.isVerified){
      return res.status(403).json({message:"this account is already verified"})
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpires = Date.now() + 100 * 60 * 1000;
    user.OTP = otp;
    user.OTPExpiry = otpExpires;  
    await user.save();
    
    try {
      await sendMail({
        to: Email,  
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It will expire in 100 minutes.`
      });
    } catch (emailError) {
      console.log("Email failed to send:", emailError);
      return res.status(500).json({ message: "Error sending email. Try again." });
    }
    res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
    next(err);
  }
};
