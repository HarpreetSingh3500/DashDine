import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import { useEffect } from "react";
import {
  addMyOrder,
  updateAssignedDeliveryBoy,
  updateOrderStatus,
  updateRealtimeOrderStatus,
} from "../redux/userSlice";
import DeliveryBoyOrderCard from "../components/DeliveryBoyOrderCard";

function MyOrders() {
  const { userData, myOrders, socket } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Define handlers so they can be referenced in cleanup
    const handleNewOrder = (data) => {
      if (data.shopOrders.owner._id === userData._id) {
        dispatch(addMyOrder(data));
      }
    };

    const handleStatusUpdate = ({
      orderId,
      shopId,
      status,
      userId,
      ownerId,
    }) => {
      if (userId === userData._id) {
        dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }));
      }
      if (ownerId === userData._id) {
        dispatch(updateOrderStatus({ orderId, shopId, status }));
      }
    };

    const handleDeliveryBoyAssigned = ({
      orderId,
      shopOrderId,
      assignedDeliveryBoy,
      ownerId,
    }) => {
      if (ownerId === userData._id) {
        dispatch(
          updateAssignedDeliveryBoy({
            orderId,
            shopOrderId,
            assignedDeliveryBoy,
          })
        );
      }
    };

    // Set up listeners
    socket?.on("newOrder", handleNewOrder);
    socket?.on("update-status", handleStatusUpdate);
    socket?.on("deliveryBoyAssigned", handleDeliveryBoyAssigned);

    // Cleanup listeners
    return () => {
      socket?.off("newOrder", handleNewOrder);
      socket?.off("update-status", handleStatusUpdate);
      socket?.off("deliveryBoyAssigned", handleDeliveryBoyAssigned);
    };
  }, [socket, userData, dispatch]);

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-4">
      <div className="w-full max-w-[800px] p-4">
        <div className=" flex items-center gap-[20px] mb-6">
          {/* back arrow button */}
          <div className="z-10">
            <IoIosArrowBack
              size={35}
              className="text-[#ff4d2d] cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            />
          </div>
          <h1 className="text-2xl font-bold text-start">My Orders</h1>
        </div>

        <div className="space-y-6">
          {myOrders.length > 0 ? (
            myOrders.map((order, index) =>
              userData.role == "user" ? (
                <UserOrderCard data={order} key={index} />
              ) : userData.role == "owner" ? (
                <OwnerOrderCard data={order} key={index} />
              ) : userData.role === "deliveryBoy" ? (
                <DeliveryBoyOrderCard data={order} key={index}/>
              ): null
            )
          ) : (
            <p className="text-gray-500 text-lg text-center">
              You have not placed any orders!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
