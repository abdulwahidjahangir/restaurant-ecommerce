"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const data = [
  {id:1, title: "Indulge in Italy's Finest Flavors, One Slice at a Time!", image: "/slide1.jpg"},
  {id:2, title: "Unleash the Flavor Explosion in Every Slice!", image: "/slide2.jpg"},
  {id:3, title: "Discover Italy’s Best Kept Secret in Every Slice!", image: "/slide3.jpg"},
]

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentSlide(prev => prev === data.length - 1 ? 0 : prev + 1)
    }, 2000)
    return () => clearInterval(interval);
  }, [])

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] lg:flex-row bg-gray-100">
      {/* TEXT CONTAINER */}
      <div className="flex-1 flex items-center justify-center flex-col gap-8 text-black font-bold ">
        <h1 className="text-5xl text-center uppercase p-4 md:p-10 md:text-6xl xl:text-7xl">
          {[data[currentSlide].title]}
        </h1>
        <button className="bg-black text-white py-4 px-8 rounded-md">
          Order Now
        </button>
      </div>
      {/* IMAGE CONTAINER */}
      <div className="w-full flex-1 relative ">
        <Image src={data[currentSlide].image} alt="" fill className="object-cover" />
      </div>
    </div>
  );
}
