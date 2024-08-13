import Link from "next/link";
import React from "react";
import CartItem from "@/components/CartItem";
import { auth } from "../_lib/auth";
import { redirect } from "next/navigation";
import CartPrice from "@/components/CartPrice";

export default async function CartPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-black lg:flex-row">
      {/* PRODUCT CONTAINER */}
      <CartItem />
      {/* PAYMENT CONTAINER */}
      
        <CartPrice />

    </div>
  );
}
