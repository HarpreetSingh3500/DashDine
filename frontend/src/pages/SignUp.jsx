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

function SignUp() {
  const [err, setErr] = useState("");
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          fullName,
          email,
          mobile,
          password,
          role,
        },
        { withCredentials: true }
      );
      setLoading(false);
      dispatch(setUserData(result.data));
      setErr("");
    } catch (error) {
      setLoading(false);
      setErr(error?.response?.data?.message);
    }
  };

  const handleGoogleAuth = async () => {
    if (!mobile) {
      return setErr("mobile number is required");
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      let { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          role,
          mobile,
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
          Create your account to get started with delicious food deliveries
        </p>

        {/* Full Name */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="fullname"
          >
            Full Name
          </label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            type="text"
            id="fullname"
            placeholder="Enter Full Name"
            style={{ border: `2px solid ${borderColor}` }}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            value={fullName}
            required
          />
        </div>

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

        {/* mobile */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="mobile"
          >
            Mobile No.
          </label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            type="text"
            id="mobile"
            placeholder="Enter Mobile Number"
            style={{ border: `2px solid ${borderColor}` }}
            onChange={(e) => {
              setMobile(e.target.value);
            }}
            value={mobile}
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

        {/* role */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="role"
          >
            Role
          </label>
          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                className="flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer"
                onClick={() => {
                  setRole(r);
                }}
                style={
                  role == r
                    ? { backgroundColor: primaryColor, color: "white" }
                    : {
                        borderColor: `1px solid ${primaryColor}`,
                        color: primaryColor,
                      }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button
          className={`w-full font-semibold py-2 rounded-lg text-white transition duration-200 bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer`}
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
        </button>
        {err && <p className="text-red-500 text-center my-[10px]">*{err}</p>}
        <button
          onClick={handleGoogleAuth}
          className="w-full mt-4 cursor-pointer flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-200"
        >
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>

        <p className="text-center mt-5">
          Already have an account? &nbsp;
          <span
            className="text-[#ff4d2d] cursor-pointer underline"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
