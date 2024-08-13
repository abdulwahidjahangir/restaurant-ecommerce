"use client";

import React, { useState, useEffect } from "react";
import classNames from "classnames";

interface StatusRowProps {
  preparationTime: string;
}

const OrderStatus: React.FC<StatusRowProps> = ({ preparationTime }) => {
  const [status, setStatus] = useState<string>("Not prepared yet");

  useEffect(() => {
    const updateStatus = () => {
      const currentTime = new Date();
      const preparationDate = new Date(preparationTime);

      const elapsedMinutes =
        (currentTime.getTime() - preparationDate.getTime()) / (1000 * 60);

      // Adjust thresholds by adding 60 minutes (1 hour)
      const newStatus =
        elapsedMinutes > 95 // 35 + 60 minutes
          ? "Delivered"
          : elapsedMinutes > 75 // 15 + 60 minutes
          ? "On the way to deliver"
          : elapsedMinutes > 70 // 10 + 60 minutes
          ? "Prepared"
          : "Not prepared yet";

      setStatus(newStatus);
    };

    // Initial status calculation
    updateStatus();

    // Interval to update status every minute
    const interval = setInterval(updateStatus, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [preparationTime]);

  return (
    <td
      className={classNames(
        "py-6 px-1",
        {
          "bg-yellow-300": status === "Prepared",
          "bg-blue-300": status === "Delivered",
          "bg-green-300": status === "On the way to deliver",
        }
      )}
    >
      {status === "Prepared" && "Prepared"}
      {status === "On the way to deliver" && "On the Way (approx. 15min)"}
      {status === "Delivered" && "Delivered"}
      {status === "Not prepared yet" && "Order Received"}
    </td>
  );
};

export default OrderStatus;
