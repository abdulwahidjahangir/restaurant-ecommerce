"use client";

import { useCart } from "@/context/CartContext";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  handleOrderSubmit: (paymentID: string) => Promise<Boolean>;
  clientSecret: string;
  total: number;
  checkFieldData: () => boolean;
};

export default function StripeCheckout({
  handleOrderSubmit,
  clientSecret,
  total,
  checkFieldData,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const { emptyCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    const isValid = checkFieldData();

    if (!isValid) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      if (!stripe || !elements) {
        throw new Error("Stripe.js hasn't loaded yet.");
      }

      const { error: submitError } = await elements.submit();

      if (submitError) {
        throw submitError;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: "if_required",
      });

      if (error) {
        throw error;
      }

      if (paymentIntent && paymentIntent.id) {
        const res = await handleOrderSubmit(paymentIntent.id);
        if (res) {
          emptyCart();
          router.push("/orders");
        }
      } else {
        throw new Error("Error during payment please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {stripe && elements && clientSecret ? (
        <>
          <PaymentElement className="w-full" />
          {errorMessage && (
            <div className="text-red-500 mt-2">{errorMessage}</div>
          )}
        </>
      ) : (
        <div>Loading...</div>
      )}
      <button
        className="mt-5 bg-black w-full text-white py-3 uppercase rounded-full hover:bg-violet-950 disabled:opacity-50"
        onClick={handlePayment}
        disabled={loading || !stripe || !elements || !clientSecret}
      >
        {loading ? "Processing..." : `Pay € ${total}`}
      </button>
    </div>
  );
}
