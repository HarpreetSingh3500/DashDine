import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { IoReceipt } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import { setSearchItems, setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Nav() {
  const { userData, currentCity, cartItems, myOrders} = useSelector(
    (state) => state.user
  );
  const { myShopData } = useSelector((state) => state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const undeliveredOrders =
    userData.role === "owner"
      ? myOrders.filter((order) => order.shopOrders.status !== "delivered")
          .length
      : 0;

  const handleSeachItems = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`,
        { withCredentials: true }
      );
      dispatch(setSearchItems(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    if (query) {
      handleSeachItems();
    }else{
      dispatch(setSearchItems(null));
    }
  },[query]);

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-[#fff9f6] overflow-visible">
      {/* search input for small devices for user */}
      {showSearch && userData.role == "user" && (
        <div className="w-[90%] h-[50px] bg-white shadow-xl rounded-lg flex fixed items-center gap-[20px] top-[80px] left-[5%]">
          {/* Location */}
          <div className="flex items-center w-[30%] overflow-hidden gap-[8px] border-r-[2px] border-gray-400">
            <FaLocationDot size={25} className="text-[#ff4d2d] ml-1" />
            <div className="w-[80%] truncate text-gray-600">{currentCity}</div>
          </div>

          {/* serach for food */}
          <div className="w-[80%] flex items-center">
            <IoIosSearch size={25} className="text-[#ff4d2d] cursor-pointer" />
            <input
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              type="text"
              placeholder="Search delicious food..."
              className="px-[10px] text-gray-700 outline-0 w-full"
            />
          </div>
        </div>
      )}

      {/* app name */}
      <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]">Dash Dine</h1>

      {/* location + food search options for user*/}

      {userData.role == "user" && (
        <div className="md:w-[60%] lg:w-[40%] h-[50px] bg-white shadow-xl rounded-lg hidden md:flex items-center gap-[20px]">
          {/* Location */}
          <div className="flex items-center w-[30%] overflow-hidden gap-[8px] border-r-[2px] border-gray-400">
            <FaLocationDot size={25} className="text-[#ff4d2d] ml-1" />
            <div className="w-[80%] truncate text-gray-600">{currentCity}</div>
          </div>

          {/* serach for food */}
          <div className="w-[80%] flex items-center">
            <IoIosSearch size={25} className="text-[#ff4d2d] cursor-pointer" />
            <input
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              type="text"
              placeholder="Search delicious food..."
              className="px-[10px] text-gray-700 outline-0 w-full"
            />
          </div>
        </div>
      )}

      {/* right side of navbar */}
      <div className="flex items-center gap-4">
        {/* search icon / cross icon for user */}

        {userData.role == "user" &&
          (showSearch ? (
            <RxCross1
              size={25}
              className="text-[#ff4d2d] md:hidden cursor-pointer"
              onClick={() => {
                setShowSearch(false);
              }}
            />
          ) : (
            <IoIosSearch
              size={25}
              className="text-[#ff4d2d] md:hidden cursor-pointer"
              onClick={() => {
                setShowSearch(true);
              }}
            />
          ))}

        {/* add button for owner */}
        {userData.role == "owner" ? (
          <>
            {myShopData && (
              <>
                <button
                  onClick={() => {
                    navigate("/add-item");
                  }}
                  className="hidden md:flex items-center gap-1 p-2 font-medium cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]"
                >
                  <FaPlus size={20} />
                  <span>Add Food Items</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/add-item");
                  }}
                  className="md:hidden flex items-center p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]"
                >
                  <FaPlus size={20} />
                </button>
              </>
            )}
            <div
              onClick={() => navigate("/my-orders")}
              className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium"
            >
              <IoReceipt size={20} />
              <span>Orders</span>
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]">
                {undeliveredOrders}
              </span>
            </div>
            <div
              onClick={() => navigate("/my-orders")}
              className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium"
            >
              <IoReceipt size={20} />
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]">
                {undeliveredOrders}
              </span>
            </div>
          </>
        ) : (
          <>
            {/* cart for user */}
            {userData.role == "user" && (
              <div
                onClick={() => navigate("/cart")}
                className="relative cursor-pointer"
              >
                <IoCartOutline size={25} className="text-[#ff4d2d]" />
                <span className="absolute right-[-9px] top-[-12px] text-[#ff4d2d]">
                  {cartItems.length}
                </span>
              </div>
            )}

            {/* my orders summary */}
            <button
              onClick={() => navigate("/my-orders")}
              className="hidden md:block cursor-pointer px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium"
            >
              My Orders
            </button>
          </>
        )}

        {/* profile */}
        <div
          onClick={() => {
            setShowInfo((prev) => !prev);
          }}
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[20px] shadow-xl font-semibold cursor-pointer"
        >
          {userData?.fullName.slice(0, 1)}
        </div>

        {/* profile menu popup */}
        {showInfo && (
          <div
            className={`fixed top-[80px] right-[10px] w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999] ${
              userData.role == "deliveryBoy"
                ? "md:right-[20%] lg:right-[38%]"
                : userData.role == "user"
                ? "md:right-[10%] lg-right-[20%]"
                : "md:right-[10%] lg:right-[30%]"
            }
            `}
          >
            <div className="text-[17px] font-semibold">
              {userData?.fullName}
            </div>

            {userData.role == "user" && (
              <div
                onClick={() => navigate("/my-orders")}
                className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer"
              >
                My Orders
              </div>
            )}

            <div
              className="text-[#ff4d2d] font-semibold cursor-pointer"
              onClick={handleLogOut}
            >
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;
