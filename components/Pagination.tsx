"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  category: string;
};

export default function Pagination({
  totalPages,
  currentPage,
  category,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState<number>(currentPage);

  useEffect(() => {
    router.push(
      `${process.env.NEXT_PUBLIC_DOMAIN}/menu/${category}?page=${page}`
    );
  }, [page, router, category]);

  return (
    <div className="flex justify-center items-center">
      <div className="flex gap-8 mt-5">
        <button
          className={`py-1 px-4 border border-black hover:bg-black hover:text-white rounded-md uppercase font-bold ${
            page <= 1 && "opacity-50"
          }`}
          onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : 1))}
          disabled={page <= 1}
        >
          Prev
        </button>
        <span className="py-1 px-4"> {page} </span>
        <button
          className={`py-1 px-4 border border-black hover:bg-black hover:text-white rounded-md uppercase font-bold ${
            page >= totalPages && "opacity-50"
          }`}
          onClick={() =>
            setPage((prev) => (prev < totalPages ? page + 1 : totalPages))
          }
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
