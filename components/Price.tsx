"use client";

import { useCart } from "../context/CartContext";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type PriceProps = {
  price: number;
  id: string;
  options: {
    title: string;
    additionalPrice: number;
  }[];
};

export default function Price({ price, id, options }: PriceProps) {
  const [total, setTotal] = useState<number>(price);
  const [quantity, setQuantity] = useState<number>(1);
  const [selected, setSelected] = useState<number>(0);
  const { addToCart } = useCart();
  const { data: session } = useSession();

  useEffect(() => {
    setTotal(
      quantity * (options ? price + options[selected].additionalPrice : price)
    );
  }, [quantity, selected, options, price]);

  const handleAddToCart = async () => {
    if (!session) {
      toast.error("Please login in to continue");
      return;
    }

    try {
      if (quantity < 0 || quantity > 9) {
        throw new Error("Quantity must be greater than 0 and less than 9");
      }
      addToCart(id, quantity, options[selected].title.toLowerCase());
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">€ {total.toFixed(2)}</h2>
      {/* OPTIONS CONTAINER */}
      <div className="flex gap-4">
        {options?.map((option, index: number) => (
          <button
            className={`min-w-[6rem] p-2 ring-1 ring-black rounded-md hover:bg-black hover:text-white ${
              index === selected && "bg-black text-white"
            }`}
            key={option.title}
            onClick={() => setSelected(index)}
          >
            {option.title}
          </button>
        ))}
      </div>
      {/* QUANTITY AND ADD BUTTON CONTAINER */}
      <div className="flex justify-between items-center">
        <div className="flex justify-between w-full p-3 ring-1 ring-black rounded-l-md">
          <span>Quantity</span>
          <div className="flex gap-4 justify-center items-center">
            <button
              disabled={quantity <= 1}
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            >
              {"<"}
            </button>
            <span>{quantity}</span>
            <button
              disabled={quantity >= 9}
              onClick={() => setQuantity((prev) => (prev < 9 ? prev + 1 : 9))}
            >
              {">"}
            </button>
          </div>
        </div>
        <button
          className="uppercase bg-black text-white p-3 ring-1 ring-black rounded-r-md w-56"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
