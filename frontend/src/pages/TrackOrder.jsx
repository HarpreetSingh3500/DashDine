import axios from "axios";
import { data, useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { useEffect } from "react";
import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
import { useSelector } from "react-redux";

function TrackOrder() {
  const { socket } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState();
  const [liveLocation,setLiveLocation] = useState({})

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true }
      );
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  useEffect(()=>{
    socket.on("updateDeliveryLocation",({deliveryBoyId,latitude,longitude})=>{
      setLiveLocation(prev=>({
        ...prev,
        [deliveryBoyId]:{lat:latitude,lon:longitude}
      }))
    });
  },[socket])

  useEffect(() => {
    const handleStatusUpdate = ({
      orderId: updatedOrderId,
      shopId,
      status,
    }) => {
      if (updatedOrderId === orderId) {
        setCurrentOrder((prevOrder) => {
          if (!prevOrder) return null;

          const newOrder = { ...prevOrder };
          const shopOrderIndex = newOrder.shopOrders.findIndex(
            (so) => so.shop._id === shopId
          );
          if (shopOrderIndex !== -1) {
            newOrder.shopOrders[shopOrderIndex].status = status;
          }
          return newOrder;
        });
      }
    };

    socket?.on("update-status", handleStatusUpdate);
    return () => {
      socket?.off("update-status", handleStatusUpdate);
    };
  }, [socket, orderId]);

  useEffect(() => {
    const handleOrderAccepted = ({
      orderId: updatedOrderId,
      shopId,
      assignedDeliveryBoy,
    }) => {
      if (updatedOrderId === orderId) {
        setCurrentOrder((prevOrder) => {
          if (!prevOrder) return null;

          const newOrder = { ...prevOrder };
          const shopOrderIndex = newOrder.shopOrders.findIndex(
            (so) => so.shop._id === shopId
          );

          if (shopOrderIndex !== -1) {
            newOrder.shopOrders[shopOrderIndex].assignedDeliveryBoy =
              assignedDeliveryBoy;
          }
          return newOrder;
        });
      }
    };

    socket?.on("orderAcceptedByDeliveryBoy", handleOrderAccepted);

    return () => {
      socket?.off("orderAcceptedByDeliveryBoy", handleOrderAccepted);
    };
  }, [socket, orderId]);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div className="relative flex items-center gap-4 top-[20px] left-[20px] z-[10] mb-[10px]">
        <IoIosArrowBack
          size={35}
          className="text-[#ff4d2d] cursor-pointer"
          onClick={() => {
            navigate("/my-orders");
          }}
        />
        <h1 className="text-2xl font-bold md:text-center">Track Order</h1>
      </div>

      {currentOrder?.shopOrders?.map((shopOrder, index) => (
        <div
          className="bg-white p-4 rounded-2xl shadow-md border border-b-orange-200 space-y-4"
          key={index}
        >
          <div>
            <p className="text-lg font-bold mb-2 text-[#ff4d2d]">
              {shopOrder.shop.name}
            </p>
            <p className="font-semibold">
              <span>Items:</span>&nbsp;
              {shopOrder.shopOrderItems.map((i) => i.name).join(",")}
            </p>
            <p>
              <span className="font-semibold">Subtotal:</span> &nbsp; &#8377;
              {shopOrder.subtotal}
            </p>
            <p>
              <span className="font-semibold">Delivery Address:</span> &nbsp;
              {currentOrder.deliveryAddress?.text}
            </p>
          </div>
          {shopOrder?.status != "delivered" ? (
            <>
              {shopOrder.assignedDeliveryBoy ? (
                <div className="text-sm text-gray-700">
                  <p className="font-semibold">
                    <span>Delivery Boy Name:</span>&nbsp;
                    {shopOrder.assignedDeliveryBoy.fullName}
                  </p>
                  <p className="font-semibold">
                    <span>Contact No:</span>&nbsp;
                    {shopOrder.assignedDeliveryBoy.mobile}
                  </p>
                </div>
              ) : (
                <p className="font-semibold">
                  Delivery boy is not assigned yet.
                </p>
              )}
            </>
          ) : (
            <p className="text-green-600 font-semibold text-lg">Delivered</p>
          )}

          {shopOrder.assignedDeliveryBoy && shopOrder.status != "delivered" && (
            <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
              <DeliveryBoyTracking
                data={{
                  deliveryBoyLocation: liveLocation[
                    shopOrder.assignedDeliveryBoy._id
                  ] || {
                    lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                    lon: shopOrder.assignedDeliveryBoy.location.coordinates[0],
                  },
                  customerLocation: {
                    lat: currentOrder.deliveryAddress.latitude,
                    lon: currentOrder.deliveryAddress.longitude,
                  },
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default TrackOrder;
