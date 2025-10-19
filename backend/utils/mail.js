import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// transporter config
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// function to send otp to user's email from my(app) email
export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Reset Your Password",
    html: `<p>Your otp for reset DashDine password is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
};

// function to send otp to user's email from my(app) email
export const sendDeliveryOtpMail = async (user, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: "Delivery OTP",
    html: `<p>Your otp for delivery confirmation is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
};
