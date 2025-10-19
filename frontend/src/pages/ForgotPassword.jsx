import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { ClipLoader } from "react-spinners";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err,setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleGenerateOtp = async () => {
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );
      setLoading(false);
      setStep(2);
    } catch (error) {
      console.log(error)
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      setLoading(false);
      setStep(3);
    } catch (error) {
      setLoading(false);
     setErr(error?.response?.data?.message);
    }
  };

  const handleResetPassword = async () => {
    if (password != confirmPassword) {
      return null;
    }
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email,password },
        { withCredentials: true }
      );
      setErr("");
      setLoading(false);
      navigate("/signin");
    } catch (error) {
      setLoading(false);
     setErr(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowBack
            size={25}
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => {
              navigate("/signin");
            }}
          />
          <h1 className="text-2xl font-bold text-center text-[#ff4d2d]">
            Forgot Password
          </h1>
        </div>
        {step == 1 && (
          <div>
            {/* Email */}
            <div className="mb-6">
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                type="email"
                id="email"
                placeholder="Enter Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                required
              />
            </div>
            <button
              className={`w-full font-semibold py-2 rounded-lg text-white transition duration-200 bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer`}
              onClick={handleGenerateOtp} disabled={loading}
            >
              {loading?<ClipLoader size={20} color="white"/>:"Send OTP"}
            </button>
            {err && <p className="text-red-500 text-center my-[10px]">*{err}</p>}
          </div>
        )}

        {step == 2 && (
          <div>
            {/* OTP */}
            <div className="mb-6">
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="otp"
              >
                OTP
              </label>
              <input
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                type="text"
                id="otp"
                placeholder="Enter OTP"
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
                value={otp}
                required
              />
            </div>
            <button
              className={`w-full font-semibold py-2 rounded-lg text-white transition duration-200 bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer`}
              onClick={handleVerifyOtp} disabled={loading}
            >
              {loading?<ClipLoader size={20} color="white"/>:"Verify"}
            </button>
            {err && <p className="text-red-500 text-center my-[10px]">*{err}</p>}
          </div>
        )}
        {step == 3 && (
          <div>
            {/* New Password */}
            <div className="mb-6">
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <input
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                type="password"
                id="newPassword"
                placeholder="Enter New Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
                required
              />
            </div>

            {/* Confirm New Password */}
            <div className="mb-6">
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                value={confirmPassword}
                required
              />
            </div>

            <button
              className={`w-full font-semibold py-2 rounded-lg text-white transition duration-200 bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer`}
              onClick={handleResetPassword} disabled={loading}
            >
              {loading?<ClipLoader size={20} color="white"/>:"Reset Password"}
            </button>
            {err && <p className="text-red-500 text-center my-[10px]">*{err}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
