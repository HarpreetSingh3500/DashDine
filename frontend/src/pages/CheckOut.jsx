import { IoIosArrowBack } from "react-icons/io";
import { IoLocationSharp, IoSearchOutline } from "react-icons/io5";
import { MdDeliveryDining } from "react-icons/md";
import { TbCurrentLocation } from "react-icons/tb";
import { FaCreditCard, FaMobileScreenButton } from "react-icons/fa6";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/mapSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { addMyOrder, clearCart } from "../redux/userSlice";
import { ClipLoader } from "react-spinners";

export function ReCenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap();
    map.setView([location.lat, location.lon], 13, { animate: true });
  }
  return null;
}

function CheckOut() {
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount, userData } = useSelector(
    (state) => state.user
  );
  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const AmountWithDeliveryFee = deliveryFee + totalAmount;

  useEffect(() => {
    setAddressInput(address);
  }, [address]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`;
      const result = await axios.get(url);
      const custom_address =
        result?.data?.features[0].properties.address_line1 +
        ", " +
        result?.data?.features[0].properties.address_line2;
      dispatch(setAddress(custom_address));
      setAddressInput(custom_address);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentLocation = () => {
    const latitude = userData.location.coordinates[1];
    const longitude = userData.location.coordinates[0];
    dispatch(setLocation({ lat: latitude, lon: longitude }));
    getAddressByLatLng(latitude, longitude);
  };

  const getLatLngByAddress = async () => {
    try {
      const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        addressInput
      )}&apiKey=${apiKey}`;
      const result = await axios.get(url);
      const { lat, lon } = result.data.features[0].properties;
      dispatch(setLocation({ lat, lon }));
    } catch (error) {
      console.log(error);
    }
  };

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lon: lng }));
    getAddressByLatLng(lat, lng);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: {
            text: addressInput,
            latitude: location.lat,
            longitude: location.lon,
          },
          totalAmount: AmountWithDeliveryFee,
          cartItems,
        },
        { withCredentials: true }
      );

      if (paymentMethod == "cod") {
        dispatch(addMyOrder(result.data));
        navigate("/order-placed");
        dispatch(clearCart());
      } else {
        const orderId = result.data.orderId;
        const razorOrder = result.data.razorOrder;
        openRazorpayWindow(orderId, razorOrder);
      }
    } catch (error) {
      console.log(error);
      setError(
        error?.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const openRazorpayWindow = (orderId, razorOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: "INR",
      name: "Dash Dine",
      description: "Food Delivery Services",
      order_id: razorOrder.id,
      handler: async function (response) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/order/verify-payment`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              orderId,
            },
            { withCredentials: true }
          );
          dispatch(addMyOrder(result.data));
          navigate("/order-placed");
          dispatch(clearCart());
        } catch (error) {
          console.log(error);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">
      {/* back arrow button */}
      <div className="absolute top-[20px] left-[20px] z-[10]">
        <IoIosArrowBack
          size={35}
          className="text-[#ff4d2d] cursor-pointer"
          onClick={() => {
            navigate("/cart");
          }}
        />
      </div>

      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

        {/* location section */}
        <section>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-1 text-gray-800">
            <IoLocationSharp size={20} className="text-[#ff4d2d]" />
            Delivery Location
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              onChange={(e) => setAddressInput(e.target.value)}
              value={addressInput}
              placeholder="Enter Your Delivery Address"
              type="text"
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
            />

            <button
              onClick={getLatLngByAddress}
              className="bg-[#ff4d2d] cursor-pointer hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center"
            >
              <IoSearchOutline size={20} className="cursor-pointer" />
            </button>
            <button
              onClick={getCurrentLocation}
              className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center"
            >
              <TbCurrentLocation
                onClick={getCurrentLocation}
                size={20}
                className="cursor-pointer"
              />
            </button>
          </div>
          <div className="rounded-xl overflow-hidden">
            <div className="h-64 w-full flex items-center justify-center">
              <MapContainer
                className={"w-full h-full"}
                center={[location?.lat, location?.lon]}
                zoom={16}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ReCenterMap location={location} />
                <Marker
                  position={[location?.lat, location?.lon]}
                  draggable
                  eventHandlers={{ dragend: onDragEnd }}
                />
              </MapContainer>
            </div>
          </div>
        </section>

        {/* payment section */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Payment Method
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* cod payment div */}
            <div
              className={`cursor-pointer flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                paymentMethod === "cod"
                  ? "border-[#ff4d2d] bg-orange-50 shadow"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => {
                setPaymentMethod("cod");
              }}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MdDeliveryDining className="text-green-600 text-xl" />
              </span>
              <div>
                <p className="font-medium text-gray-800">Cash On Delivery</p>
                <p className="text-[14px] text-gray-500">
                  Pay when your food arrives
                </p>
              </div>
            </div>

            {/* online payment div */}
            <div
              className={`cursor-pointer flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                paymentMethod === "online"
                  ? "border-[#ff4d2d] bg-orange-50 shadow"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => {
                setPaymentMethod("online");
              }}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <FaMobileScreenButton className="text-pink-700 text-lg" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <FaCreditCard className="text-blue-700 text-lg" />
              </span>
              <div>
                <p className="font-medium text-gray-800">
                  UPI / Credit / Debit Card
                </p>
                <p className="text-[14px] text-gray-500">Pay Securly Online</p>
              </div>
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Order Summary
          </h2>
          <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
            {cartItems?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-700"
              >
                <span className="">
                  {item.name} x {item.quantity}
                </span>
                <span>&#8377;{item.price * item.quantity}</span>
              </div>
            ))}
            <hr className="border-gray-200 my-2 " />
            <div className="flex justify-between font-medium text-gray-800">
              <span>Subtotal</span>
              <span>&#8377;{totalAmount}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span>
                {deliveryFee == 0
                  ? "Free"
                  : deliveryFee.toLocaleString("en-In", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                    })}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#ff4d2d] pt-2">
              <span>Grand Total</span>
              <span>&#8377;{AmountWithDeliveryFee}</span>
            </div>
          </div>
        </section>

        {error && (
          <p className="text-red-500 text-center text-sm font-semibold">
            {error}
          </p>
        )}

        {/* place order button */}
        <button
          disabled={loading}
          onClick={handlePlaceOrder}
          className="w-full cursor-pointer bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold"
        >
          {loading ? (
            <ClipLoader size={20} color="white" />
          ) : paymentMethod == "cod" ? (
            "Place Order"
          ) : (
            "Pay & Place Order"
          )}
        </button>
      </div>
    </div>
  );
}

export default CheckOut;
