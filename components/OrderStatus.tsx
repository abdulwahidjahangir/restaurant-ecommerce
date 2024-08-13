"use client";

import React from "react";

interface StatusRowProps {
  preparationTime: string;
}

const OrderStatus: React.FC<StatusRowProps> = ({ preparationTime }) => {
  const currentTime = new Date();

  const elapsedMinutes =
    (currentTime.getTime() - new Date(preparationTime).getTime()) / (1000 * 60);

  const status =
    elapsedMinutes > 35
      ? "Delivered"
      : elapsedMinutes > 15
      ? "On the way to deliver"
      : elapsedMinutes > 10
      ? "Prepared"
      : "Not prepared yet";

  return (
    <td
      className={`py-6 px-1 ${status === "Prepared" && "bg-yellow-300"} ${
        status === "Delivered" && "bg-blue-300"
      } ${status === "On the way to deliver" && "bg-green-300"}`}
    >
      {status === "Prepared" && "Prepared"}
      {status === "On the way to deliver" && "On the Way (approx. 15min)"}
      {status === "Delivered" && "Delivered"}
      {status === "Not prepared yet" && "Order Recieved"}
    </td>
  );
};

export default OrderStatus;
