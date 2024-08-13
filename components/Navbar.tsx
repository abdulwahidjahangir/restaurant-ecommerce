import Link from "next/link";
import React from "react";
import Menu from "./Menu";
import CartIcon from "./CartIcon";
import Image from "next/image";
import { auth } from "@/app/_lib/auth";
import SignOut from "./SignOut";

export default async function Navbar() {
  const session = await auth();

  return (
    <div className="h-12 text-black p-2 flex items-center justify-between border-b-2 border-b-black uppercase md:h-20 xl:px-40">
      {/* LEFT LINKS */}
      <div className="hidden md:flex gap-4 flex-1">
        <Link href="/menu">Menu</Link>
        <Link href="/contact">Contact</Link>
      </div>
      {/* LOGO */}
      <div className="text-xl md:font-bold flex-1 md:text-center lg:text-3xl">
        <Link href="/">Wahid</Link>
      </div>
      {/* RIGHT LINKS */}
      <div className="hidden md:flex gap-4 items-center justify-end flex-1">
        <div className=" md:absolute top-3 r-2 lg:static flex items-center gap-2 bg-orange-300 px-1 rounded-md">
          <Image src="/phone.png" alt="" width={20} height={20} />
          <span>123 456 7890</span>
        </div>
        {/* {!session || !session?.user ? ( */}
        {!session ? (
          <Link href="/auth/login">Login</Link>
        ) : (
          <>
            <Link href="/orders">Orders</Link>
            <SignOut />
            <CartIcon />
          </>
        )}
      </div>
      {/* MOBILE MENI */}
      <div className="md:hidden">
        <Menu />
      </div>
    </div>
  );
}
