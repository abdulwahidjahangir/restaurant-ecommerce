import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Options = {
  title: string;
  additionalPrice: number;
};

type Product = {
  _id: string;
  title: string;
  desc: string;
  img: string;
  price: number;
  options: Options[];
  category: string;
};

type ProductRes = {
  products?: Product[];
  error?: boolean;
};

async function getFeaturedProduct(): Promise<ProductRes> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/product/isFeatured`
    );
    return { products: res.data.product };
  } catch (err: any) {
    return { error: true };
  }
}

export default async function Featured() {
  const { products, error } = await getFeaturedProduct();

  if (error || !products) {
    return (
      <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)] flex flex-col items-center justify-center">
        <h1 className="text-red-500 text-2xl">
          Error While Loading Data. Please try again later.
        </h1>
      </div>
    );
  }

  return (
    <div className="w--screen overflow-x-scroll text-black scrollbar-none">
      {/* WRAPPER */}
      <div className="w-max flex">
        {/* SINGLE ITEM */}
        {products && products.map((item: any) => (
          <Link key={item._id} href={`/product/${item._id}`}>
            <div
              className="w-screen h-[60vh] flex flex-col items-center justify-around p-4 hover:bg-gray-300 transition-all duration-300
            md:w-[50vw] xl:w-[33vw] xl:h-[90vh]"
            >
              {/* IMAGE CONTAINER */}
              {item.img && (
                <div className="relative flex-1 w-full hover:rotate-[60deg] transition-all duration-500">
                  <Image
                    src={item.img}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              {/* TEXT CONTAINER */}
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 ">
                <h1 className="text-xl font-bold uppercase xl:text-2xl 2xl:text-3xl">
                  {item.title}
                </h1>
                <p className="p-4 2xl:p-8">{item.desc}</p>
                <span className="text-xl font-bold">€ {item.price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
