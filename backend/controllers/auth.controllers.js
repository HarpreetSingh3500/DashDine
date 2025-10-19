import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import {sendOtpMail} from "../utils/mail.js";

// signup control
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;
    let user = await User.findOne({ email });

    // check if user already exist
    if (user) {
      return res.status(400).json({ message: "User already exist!" });
    }

    // check if password is smaller means not secure
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least of 6 chracters." });
    }

    // check mobile number correctness
    if (mobile.length < 10) {
      return (
        res.status(400).json({ message: "Mobile no. must be of 10 digits." })
      );
    }

    // make password more secure with hashing and salting hash( password string, salting of numbers)
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role,
    });

    // add user token to cookies
    const token = await genToken(user._id);
    res.cookie("token", token, {
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json(`sign up error: ${error}`);
  }
};

// signin control
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist!" });
    }

    // match password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password!" });
    }

    // add user token to cookies
    const token = await genToken(user._id);
    res.cookie("token", token, {
       secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(`sign in error: ${error}`);
  }
};

// signout control
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token"); // remove logged in user token from cookies
    return res.status(200).json({ message: "Log out successfully." });
  } catch (error) {
    return res.status(500).json(`sign out error: ${error}`);
  }
};

// for sending otp
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist!" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();
    await sendOtpMail(email, otp);
    return res.status(200).json({ message: "otp sent successfully." });
  } catch (error) {
    return res.status(500).json(`send otp error: ${error}`);
  }
};

// for otp verification
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    let user = await User.findOne({ email });
    if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid/Expired OTP" });
    }
    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.status(200).json({ message: "otp verified successfully." });
  } catch (error) {
    return res.status(500).json(`otp verification error: ${error}`);
  }
};

// to reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "otp verification required." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();
    return res.status(200).json({ message: "password reset successfully." });
  } catch (error) {
    return res.status(500).json(`reset password error: ${error}`);
  }
};

//to save user using google auth
export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, mobile, role } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ fullName, email, mobile,role });
    }

    // add user token to cookies
    const token = await genToken(user._id);
    res.cookie("token", token, {
       secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(`google authentication error: ${error}`);
  }
};
