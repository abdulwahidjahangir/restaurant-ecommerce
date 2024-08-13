import Pagination from "../../../components/Pagination";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type SearchParams = {
  page?: string;
};

type CategoryPageProps = {
  params: {
    category: string;
  };
  searchParams: SearchParams;
};

type Option = {
  title: string;
  additionalPrice: number;
};

type Product = {
  _id: string;
  title: string;
  desc: string;
  img: string;
  price: number;
  isFeatured: boolean;
  options: Option[];
};

type ProductData = {
  totalPages?: number;
  products?: Product[];
  error?: boolean;
};

async function getProducts(
  category: string,
  pageNumber: number
): Promise<ProductData> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/category/${category}?page=${pageNumber}`
    );
    return { totalPages: res.data.totalPages, products: res.data.products };
  } catch (error) {
    return { error: true };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const pageNumber = parseInt(searchParams?.page || "") || 1;
  const { totalPages, products, error } = await getProducts(
    params.category,
    pageNumber
  );

  if (error) {
    return (
      <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)] flex flex-col items-center justify-center">
        <h1 className="text-red-500 text-2xl">
          Error While Loading Data. Please try again later.
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap text-black">
        {products &&
          products.map((item) => (
            <Link
              key={item._id}
              href={`/product/${item._id}`}
              className="w-full h-[60vh] border-r-2 border-b-2 border-black md:w-1/2 xl:w-1/3 p-4 flex flex-col justify-between group even:bg-gray-200 overflow-hidden "
            >
              {/* IMAGE CONTAINER */}

              {item.img && (
                <div className="relative h-[80%]">
                  <Image
                    src={item.img}
                    alt=""
                    fill
                    className="object-contain hover:rotate-[60deg] transition-all duration-500"
                  />
                </div>
              )}
              {/* TEXT CONTAINER */}
              <div className="flex justify-between items-center font-bold">
                <h1 className="text-2xl uppercase p-2">{item.title}</h1>
                <h2 className="group-hover text-xl">€{item.price}</h2>
              </div>
            </Link>
          ))}
      </div>
      {totalPages && (
        <Pagination
          totalPages={totalPages}
          currentPage={pageNumber}
          category={params.category}
        />
      )}
    </>
  );
}
