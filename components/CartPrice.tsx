"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function CartPrice() {
  const [total, setTotal] = useState<number>(0);

  const { cart: cartItems } = useCart();

  useEffect(() => {
    let tempTotal = cartItems.cartArray.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );
    setTotal(tempTotal);
  }, [total, cartItems]);

  if (cartItems.cartArray.length === 0) {
    return null;
  }

  return (
    <>
      <div className="h-1/2 p-4 bg-gray-300 flex flex-col gap-4 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 lg:p-10 xl:p-20 2xl:text-xl 2xl:gap-6">
        <div className="flex justify-between">
          <span className="">Subtotal (3 items)</span>
          <span className="">€ {total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="">Shipping</span>
          <span className="">{total < 30 ? "€ 5.00" : "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">
            € {total < 30 ? (total + 5).toFixed(2) : total.toFixed(2)}
          </span>
        </div>
        <Link
          href={"/cart/checkout"}
          className="bg-black text-white p-3 rounded-md w-1/2 self-end text-center"
        >
          Checkout
        </Link>
      </div>
    </>
  );
}
