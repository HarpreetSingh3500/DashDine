import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaLocationDot, FaStore, FaUtensils } from "react-icons/fa6";
import FoodCard from "../components/FoodCard";
import { IoIosArrowBack } from "react-icons/io";
import { ClipLoader } from "react-spinners";

function Shop() {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleShop = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/get-by-shop/${shopId}`,
        { withCredentials: true }
      );
      setShop(result.data.shop);
      setItems(result.data.items);
    } catch (error) {
      console.log(error);
      setError("Could not load shop details. Please go back and try again.");
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    handleShop();
  }, [shopId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader size={50} color="#ff4d2d" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-red-500 text-xl">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-[#ff4d2d] text-white px-4 py-2 rounded-lg"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute cursor-pointer top-4 left-4 z-20 flex items-center gap-2 bg-black/50 hover:bg-black/90 text-white px-3 py-2 rounded-full shadow transition"
      >
        <IoIosArrowBack />
        <span>Back</span>
      </button>

      {/* upper part with shop image */}
      {shop && (
        <div className="relative w-full h-64 md:h-80 lg:h-96">
          <img src={shop.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 flex flex-col justify-center items-center text-center px-4">
            <FaStore className="text-white text-4xl mb-3 drop-shadow-md" />
            <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              {shop.name}
            </h1>
            <div className="flex mt-[10px] items-center gap-[9px]">
              <FaLocationDot size={26} color="red" />
              <p className="text-lg font-medium text-center text-gray-200 mt-[10px]">
                {shop.address}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="flex items-center justify-center gap-3 text-3xl font-bold mb-10 text-gray-800">
          <FaUtensils color="red" /> Our Menu
        </h2>
        {items.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {items.map((item) => (
              <FoodCard data={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No Items Available
          </p>
        )}
      </div>
    </div>
  );
}

export default Shop;
