import axios from "axios";
import Link from "next/link";
import React from "react";

type Menu = {
  _id: string;
  slug: string;
  title: string;
  desc?: string;
  image?: string;
  color: string;
};

type FetchCategoriesResponse = {
  categories?: Menu[];
  error?: boolean;
};

async function fetchCategories(): Promise<FetchCategoriesResponse> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/category`
    );
    return { categories: res.data.categories };
  } catch (error) {
    return { error: true };
  }
}

export default async function MenuPage() {
  const { categories, error } = await fetchCategories();

  if (error) {
    return (
      <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)] flex flex-col items-center justify-center">
        <h1 className="text-red-500 text-2xl">
          Error While Loading Categories. Please try again later.
        </h1>
      </div>
    );
  }

  return (
    <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)] flex flex-col md:flex-row items-center">
      {categories?.map((category: Menu) => (
        <Link
          key={category._id}
          href={`/menu/${category.slug}`}
          className="w-full h-1/3 bg-cover p-8 md:h-1/2"
          style={{ backgroundImage: `url(${category.image})` }}
        >
          {/* TEXT CONTAINER */}
          <div className={`text-${category.color} w-1/2`}>
            <h1 className="uppercase font-bold text-3xl">{category.title}</h1>
            <p className="text-sm my-8">{category.desc}</p>
            <button className="hidden 2xl:block bg-black text-white py-2 px-4 rounded-md">
              Explore
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}
