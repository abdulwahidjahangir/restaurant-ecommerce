"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CartIcon from "./CartIcon";

interface PageLink {
  id: number;
  title: string;
  url: string;
}

const links = [
  { id: 1, title: "Menu", url: "/menu" },
  { id: 2, title: "Working Hours", url: "/" },
  { id: 3, title: "Contact", url: "/" },
];

export default function Menu() {
  const [open, setOpen] = useState<boolean>(false);
  const [user, setUser] = useState<boolean>(false);

  return (
    <div>
      {!open ? (
        <Image
          src="/open.png"
          alt=""
          width={20}
          height={20}
          onClick={() => setOpen(true)}
        />
      ) : (
        <Image
          src="/close.png"
          alt=""
          width={20}
          height={20}
          onClick={() => setOpen(false)}
        />
      )}
      {open && (
        <div className="bg-black text-white absolute left-0 top-24 h-[calc(100vh-6rem)] w-full flex flex-col items-center justify-center text-3xl gap-8 z-10">
          {links.map((item: PageLink) => (
            <Link href={item.url} key={item.id} onClick={() => setOpen(false)}>
              {item.title}
            </Link>
          ))}
          {!user ? (
            <Link href="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
          ) : (
            <Link href="/orders" onClick={() => setOpen(false)}>
              Order
            </Link>
          )}
          <Link href="/cart">
            <CartIcon />
          </Link>
        </div>
      )}
    </div>
  );
}
