import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <div className="h-12 md:h-20 p-2 xl:px-40 text-black flex items-center justify-between">
      <Link href={"/"} className="font-bold md:text-xl">
        WAHID
      </Link>
      <p className="text-base md:text-md">&copy; ALL RIGHTS RESERVED</p>
    </div>
  );
}
