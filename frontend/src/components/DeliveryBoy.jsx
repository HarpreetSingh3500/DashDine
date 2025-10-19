import { useSelector } from "react-redux";
import Nav from "./Nav";
import axios from "axios";
import { serverUrl } from "../App";
import { useEffect, useState } from "react";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClipLoader } from "react-spinners";

function DeliveryBoy() {
  const { userData, socket } = useSelector((state) => state.user);
  const [availableAssignments, setAvailableAssignments] = useState(null);
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [loading,setLoading] = useState(false);
  const [message,setMessage] = useState("")
  const [accepting, setAccepting] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, {
        withCredentials: true,
      });
      setAvailableAssignments(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-current-order/`,
        { withCredentials: true }
      );
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("newAssignment", (data) => {
      if (data.sentTo == userData._id) {
        setAvailableAssignments((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("newAssignment");
    };
  }, []);

  useEffect(() => {
    getAssignments();
    getCurrentOrder();
    handleTodayDeliveries();
  }, [userData]);

  useEffect(() => {
    if (!socket || userData.role !== "deliveryBoy") return;
    let watchId;
    if (navigator.geolocation) {
      (watchId = navigator.geolocation.watchPosition((pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        setDeliveryBoyLocation({
          lat: latitude,
          lon: longitude,
        });

        socket.emit("update-location", {
          latitude,
          longitude,
          userId: userData._id,
        });
      })),
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
        };
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, userData]);

  const ratePerDelivery = 50;
  const totalEarning = todayDeliveries.reduce(
    (sum, d) => sum + d.count * ratePerDelivery,
    0
  );

  const acceptOrder = async (assignmentId) => {
    setAccepting(true)
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true }
      );
      setAccepting(false)
      console.log(result);
      await getCurrentOrder();
    } catch (error) {
      console.log(error);
      setAccepting(false)
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        { orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id },
        { withCredentials: true }
      );
      setLoading(false)
      console.log(result);
      setShowOtpBox(true);
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  const verifyOtp = async () => {
    setVerifying(true)
    setMessage("")
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp,
        },
        { withCredentials: true }
      );
      console.log(result);
      setVerifying(false)
      setMessage(result.data.message);
      setCurrentOrder(null);
      setShowOtpBox(false);
      setOtp("");
      getAssignments();
      location.reload()
    } catch (error) {
      console.log(error);
      setVerifying(false)
    }
  };

  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-today-deliveries`,
        { withCredentials: true }
      );
      setTodayDeliveries(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Nav />
      <div className="w-full max-w-[800px] flex flex-col gap-5 items-center">
        {/* welcome div with name and coordinates */}
        <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-2 justify-start items-center w-[90%] border border-orange-100">
          <h1 className="text-xl font-bold text-[#ff4d2d]">
            Welcome, {userData.fullName}
          </h1>
          <p className="text-[#ff4d2d]">
            <span className="font-semibold">Latitude:</span>{" "}
            {deliveryBoyLocation
              ? deliveryBoyLocation.lat
              : userData.location.coordinates[1]}
            , &nbsp;
            <span className="font-semibold">Longitude:</span>{" "}
            {deliveryBoyLocation
              ? deliveryBoyLocation.lon
              : userData.location.coordinates[0]}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-100">
          <h1 className="text-lg font-bold mb-3 text-[#ff4d2d]">
            Today's Deliveries:
          </h1>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={todayDeliveries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value) => [value, "orders"]}
                labelFormatter={(label) => `${label}:00`}
              />
              <Bar dataKey="count" fill="#ff4d2d" />
            </BarChart>
          </ResponsiveContainer>

          <div className="max-w-sm mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg text-center">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Today's Earning:{" "}
            </h1>
            <span className="text-3xl font-bold text-green-600">
              &#8377;{totalEarning}
            </span>
          </div>
        </div>

        {/* available assignments display card */}
        {!currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h1 className="text-lg font-bold mb-4 flex items-center gap-2">
              Available Orders:
            </h1>

            <div className="space-y-4">
              {availableAssignments?.length > 0 ? (
                availableAssignments.map((a, index) => (
                  <div
                    className="border rounded-lg p-4 flex justify-between items-center"
                    key={index}
                  >
                    <div>
                      <p className="text-sm font-semibold">{a.shopName}</p>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Delivery Address:</span>{" "}
                        {a.deliveryAddress.text}
                      </p>
                      <p className="text-xs text-gray-400">
                        {a.items.length} items | {a.subtotal}
                      </p>
                    </div>
                    <button
                      disabled={accepting}
                      onClick={() => {
                        acceptOrder(a.assignmentId);
                      }}
                      className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600"
                    >
                      {accepting ? (
                        <ClipLoader size={20} color="white" />
                      ) : (
                        "Accept"
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">
                  No Available Order Assignments
                </p>
              )}
            </div>
          </div>
        )}

        {/* accepted orders dispaly card */}
        {currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h2 className="text-lg font-bold mb-3">📦Current Order</h2>
            <div className="border rounded-lg p-4 mb-3">
              <p className="font-semibold text-sm">
                {currentOrder?.shopOrder.shop.name}
              </p>
              <p className="text-sm text-gray-500">
                {currentOrder?.deliveryAddress.text}
              </p>
              <p className="text-xs text-gray-400">
                {currentOrder.shopOrder.shopOrderItems.length} items | &#8377;
                {currentOrder.shopOrder.subtotal}
              </p>
            </div>

            {/* tracking map  */}
            <DeliveryBoyTracking
              data={{
                deliveryBoyLocation: deliveryBoyLocation || {
                  lat: userData.location.coordinates[1],
                  lon: userData.location.coordinates[0],
                },
                customerLocation: {
                  lat: currentOrder.deliveryAddress.latitude,
                  lon: currentOrder.deliveryAddress.longitude,
                },
              }}
            />

            {!showOtpBox ? (
              <button
                disabled={loading}
                onClick={sendOtp}
                className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200"
              >
                {loading ? (
                  <ClipLoader size={20} color="white" />
                ) : (
                  "Mark As Delivered"
                )}
              </button>
            ) : (
              <div className="mt-4 p-4 border rounded-xl bg-gray-50">
                <p className="text-sm font-semibold mb-2">
                  Enter OTP send to{" "}
                  <span className="text-orange-500">
                    {currentOrder.user.fullName}
                  </span>
                </p>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  type="text"
                  className="w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {message && (
                  <p className="text-center text-green-400">{message}</p>
                )}
                <button
                  disabled={verifying}
                  onClick={verifyOtp}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all"
                >
                  {verifying ? (
                    <ClipLoader size={20} color="white" />
                  ) : (
                    "Submit OTP"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryBoy;
