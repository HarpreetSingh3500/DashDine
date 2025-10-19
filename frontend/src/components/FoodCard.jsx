import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import {
  FaDrumstickBite,
  FaLeaf,
  FaMinus,
  FaPlus,
  FaRegStar,
  FaStar,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";

function FoodCard({ data }) {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar className="text-yellow-500 text-lg" />
        ) : (
          <FaRegStar className="text-yellow-500 text-lg" />
        )
      );
    }
    return stars;
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
    }
  };

  return (
    <div className="w-[250px] rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative w-full h-[170px] flex justify-center items-center bg-white">
        <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
          {data.foodType == "veg" ? (
            <FaLeaf className="text-green-600 text-lg" />
          ) : (
            <FaDrumstickBite className="text-lg text-red-600" />
          )}
        </div>

        <img
          src={data.image}
          alt=""
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
        />
      </div>

      <div className="flex-1 flex flex-col p-4">
        <h1 className="font-semibold text-gray-900 text-base truncate">
          {data.name}
        </h1>
        <div className="flex items-center gap-1 mt-1">
          {renderStars(data.rating?.average || 0)}
          <span className="text-xs text-gray-500">
            {data.rating?.count || 0}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto p-3">
        <span className="font-bold text-gray-900 text-lg">
          &#8377;{data.price}
        </span>
        <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
          <button
            onClick={handleDecrease}
            className="px-2 py-1 hover:bg-gray-100 transition cursor-pointer"
          >
            <FaMinus size={13} />
          </button>
          <span>{quantity}</span>
          <button
            onClick={handleIncrease}
            className="px-2 py-1 hover:bg-gray-100 transition cursor-pointer"
          >
            <FaPlus size={13} />
          </button>
          <button
            onClick={() => {
                if (quantity>0) {
                    dispatch(
                      addToCart({
                        id: data._id,
                        name: data.name,
                        price: data.price,
                        image: data.image,
                        shop: data.shop,
                        quantity,
                        foodType: data.foodType,
                      })
                    );
                }
            }
            }
            className={`${cartItems.some(i=>i.id==data._id)?"bg-gray-800":"bg-[#ff4d2d]"} text-white px-3 py-2 transition-colors cursor-pointer`}
          >
            <FaShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
