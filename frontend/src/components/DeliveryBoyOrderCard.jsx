import React from "react";

function DeliveryBoyOrderCard({ data }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const deliveryFee = 50; // Fixed rate per delivery

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4 border border-gray-200">
      <div className="flex justify-between border-b pb-2">
        <div className="font-semibold">
          <p>Order #{data._id.slice(-6)}</p>
          <p className="text-sm text-gray-500">
            Delivered on: {formatDate(data.deliveredAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-green-600">Delivered</p>
          <p className="font-medium text-gray-800">
            Earning: &#8377;{deliveryFee}
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-3 bg-gray-50 space-y-3">
        <p className="font-bold text-gray-800">{data.shopName}</p>

        <div>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Customer:</span> {data.customerName}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Address:</span>{" "}
            {data.deliveryAddress}
          </p>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-2">
          {data.items.map((item, index) => (
            <div
              className="flex-shrink-0 w-40 border rounded-lg p-1 bg-white"
              key={index}
            >
              <img
                src={item.item.image}
                alt={item.name}
                className="w-full h-24 object-cover rounded"
              />
              <p className="text-sm font-semibold mt-1">{item.name}</p>
              <p className="text-xs text-gray-500">
                Qty: {item.quantity} x &#8377;{item.price}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-end items-center border-t pt-2">
          <p className="font-semibold">Order Total: &#8377;{data.subtotal}</p>
        </div>
      </div>
    </div>
  );
}

export default DeliveryBoyOrderCard;
