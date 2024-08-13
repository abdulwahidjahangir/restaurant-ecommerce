"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { toast } from "react-toastify";

export default function CartItem() {
  const { cart: cartItems, removeFromCart, updateCart } = useCart();
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const newTotal = cartItems.cartArray.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );
    setTotal(newTotal);
  }, [cartItems.cartArray]);

  const handleRemoveFromCart = async (id: string, size: string) => {
    try {
      removeFromCart(id, size);
    } catch (error) {}
  };

  const handleUpdateQuantity = (
    itemID: string,
    newQuantity: number,
    size: string
  ) => {
    try {
      if (newQuantity < 1) {
        toast.error("There must be alt least one item for type");
        return;
      }
      if (newQuantity > 9) {
        toast.error("You can add maximum of 9 item for type");
        return;
      }
      updateCart(itemID, newQuantity, size.toLowerCase());
    } catch (error) {}
  };

  if (cartItems.cartArray.length === 0) {
    return (
      <p className="flex justify-center items-center w-full text-3xl capitalize text-yellow-500">
        Please add an item in cart to continue
      </p>
    );
  }

  return (
    <div className="h-1/2 p-4 flex flex-col justify-center overflow-scroll scrollbar-none lg:h-full lg:w-2/3 2xl:w-1/2 lg:p-10 xl:p-20">
      {cartItems.cartArray.map((item) => (
        <div className="flex items-center justify-between mb-4 " key={item.id}>
          <Image
            src={item.img}
            alt=""
            width={100}
            height={100}
            className="object-contain"
          />
          <div className="w-[200px]">
            <h1 className="uppercase font-bold text-lg">
              {item.name.substring(0, 15)}
              {item.name.length > 15 && "..."}
            </h1>
            <span className="block">Size: {item.size}</span>
            <div className="block mt-1">
              Quantity:
              <span
                className={`ml-5 py-1 px-2 border border-black cursor-pointer ${
                  item.quantity === 1 && "opacity-50"
                } `}
                onClick={() =>
                  handleUpdateQuantity(item.id, item.quantity - 1, item.size)
                }
              >
                {"<"}
              </span>
              <span className={`py-1 px-4 border border-black`}>
                {item.quantity}
              </span>
              <span
                className={`py-1 px-2 border border-black cursor-pointer  ${
                  item.quantity === 9 && "opacity-50"
                } `}
                onClick={() =>
                  handleUpdateQuantity(item.id, item.quantity + 1, item.size)
                }
              >
                {">"}
              </span>
            </div>
          </div>
          <h2 className="font-bold">€ {item.totalPrice.toFixed(2)}</h2>
          <span
            className="cursor-pointer"
            onClick={() => handleRemoveFromCart(item.id, item.size)}
          >
            X
          </span>
        </div>
      ))}
    </div>
  );
}
