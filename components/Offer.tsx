import Image from "next/image";
import React from "react";
import CountDown from "./CountDown";
import Link from "next/link";

export default function Offer() {
  return (
    <div className="bg-black h-screen flex flex-col md:flex-row md:justify-between md:bg-[url('/offerBg.png')] md:h-[70vh]">
      {/* TEXT CONTAINER */}
      <div className="flex-1 flex flex-col justify-center items-center text-center gap-8 p-6">
        <h1 className="text-white text-5xl font-bold lg:text-6xl">
          Discover Unique & Tasty Delights
        </h1>
        <p className="text-white xl:text-xl">
          Explore a variety of interesting and mouth-watering products crafted
          to satisfy your cravings. Find something delicious today!
        </p>
        <Link
          href="/menu"
          className="bg-red-500 text-white rounded-md py-3 px-6"
        >
          Check Our Menu
        </Link>
      </div>
      {/* IMAGE CONTINER */}
      <div className="flex-1 w-full relative md:h-full">
        <Image src="/offerProduct.png" alt="" fill className="object-contain" />
      </div>
    </div>
  );
}
