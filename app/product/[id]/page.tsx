import Price from "../../../components/Price";
import axios from "axios";
import Image from "next/image";
import React from "react";

type ProductParams = {
  params: {
    id: string;
  };
};

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
  product?: Product;
  error?: boolean;
};

async function getProduct(id: string): Promise<ProductRes> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/product/${id}`
    );
    return { product: res.data.product };
  } catch (error) {
    return { error: true };
  }
}

export default async function SingleProduct({ params }: ProductParams) {
  const { product, error } = await getProduct(params.id);

  if (error || !product) {
    return (
      <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)] flex flex-col items-center justify-center">
        <h1 className="text-red-500 text-2xl">
          404 Product Not Found!
        </h1>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-20 xl:p-40 h-screen md:h-[80vh] flex flex-col justify-around text-black md:flex-row md:gap-8 items-center">
      {/* IMAGE CONTAINER */}
      {product.img && (
        <div className="relative w-full h-1/2  md:h-[70%] justify-center">
          <Image src={product.img} alt="" fill className="object-contain" />
        </div>
      )}
      {/* TEXT CONTAINER */}
      <div className="flex flex-col gap-4 h-1/2 md:h-[70%] justify-center md:gap-6 lg:gap-10 w-full">
        <h1 className="text-3xl font-bold uppercase xl:text-5xl ">
          {product.title}
        </h1>
        <p>{product.desc}</p>
        <Price
          price={product.price}
          id={product._id}
          options={product.options}
        />
      </div>
    </div>
  );
}
