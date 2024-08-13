"use client";

import { useCart } from "@/context/CartContext";
import { Elements } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckout from "./StripeCheckout";
import axios from "axios";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

export default function Payment({
  handleOrderSubmit,
  checkFieldData,
}: {
  handleOrderSubmit: (paymentID: string) => Promise<Boolean>;
  checkFieldData: () => boolean;
}) {
  const { cart } = useCart();

  const [total, setTotal] = useState<number>(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    let newTotal = cart.cartArray.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );
    newTotal = newTotal < 30 ? newTotal + 5 : newTotal;
    setTotal(newTotal);
  }, [cart.cartArray]);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/cart/payment-intent`
        );
        setClientSecret(res.data.paymentIntent);
      } catch (error) {
        console.error("Failed to create payment intent:", error);
      }
    };

    fetchPaymentIntent();
  }, [total]);

  if (!clientSecret) {
    return (
      <div className="w-full h-[20px] flex justify-center items-center"></div>
    );
  }

  return (
    <div>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <StripeCheckout
          handleOrderSubmit={handleOrderSubmit}
          clientSecret={clientSecret}
          total={total}
          checkFieldData={checkFieldData}
        />
      </Elements>
    </div>
  );
}
