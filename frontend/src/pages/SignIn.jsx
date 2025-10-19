import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      setLoading(false);
      dispatch(setUserData(result.data));
      setErr[""];
    } catch (error) {
      setLoading(false);
      setErr(error?.response?.data?.message);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      let { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          email: result.user.email,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(data));
    } catch (error) {}
  };

  const navigate = useNavigate();

  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
        style={{ border: `2px solid ${borderColor}` }}
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
          Dash Dine
        </h1>
        <p className="text-gray-600 mb-8">
          Sign in to your account to get started with delicious food deliveries
        </p>

        {/* Email */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            type="email"
            id="email"
            placeholder="Enter Email"
            style={{ border: `2px solid ${borderColor}` }}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            required
          />
        </div>

        {/* password */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              className="w-full border rounded-lg px-2 py-2 focus:outline-none"
              type={`${showPassword ? "text" : "password"}`}
              id="password"
              placeholder="Enter Password"
              style={{ border: `2px solid ${borderColor}` }}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              required
            />
            <button
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 cursor-pointer top-[14px] text-gray-500"
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>
        <div
          className="text-right mb-4 text-[#ff4d2d] font-medium"
          onClick={() => {
            navigate("/forgot-password");
          }}
        >
          <span className="cursor-pointer">Forget Password?</span>
        </div>
        <button
          className={`w-full font-semibold py-2 rounded-lg text-white transition duration-200 bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer`}
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : " Sign In"}
        </button>
        {err && <p className="text-red-500 text-center my-[10px]">*{err}</p>}
        <button
          onClick={handleGoogleAuth}
          className="w-full mt-4 cursor-pointer flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-200"
        >
          <FcGoogle size={20} />
          <span>Sign In with Google</span>
        </button>

        <p className="text-center mt-5">
          Don't have an account? &nbsp;
          <span
            className="text-[#ff4d2d] cursor-pointer underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
