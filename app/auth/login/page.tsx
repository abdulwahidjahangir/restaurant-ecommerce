"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn, SignInResponse } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("test@test.com");
  const [password, setPassword] = useState<string>("qwerty123");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result: SignInResponse | undefined = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      toast.error("Invalid Email or Password");
      return;
    }

    if (result?.ok) {
      router.push("/"); 
      router.refresh();
    }
  };

  return (
    <div className="p-4 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex items-center justify-center">
      {/* BOX */}
      <div className="h-[80%] w-[90vw] shadow-2xl rounded-md flex flex-col md:flex-row md:h-[50%] md:w-full lg:w-[60%] 2xl:w-1/2">
        {/* IMAGE CONTAINER */}
        <div className=" relative h-2/3 w-full md:h-full md:w-1/2">
          <Image src="/loginBg.png" alt="" fill className="object-cover" />
        </div>
        {/* FORM CONTAINER */}
        <div className="p-5 md:p-10 flex flex-col gap-8 md:w-1/2 ">
          <div className="w-full">
            <h1 className="font-bold text-xl xl:text-3xl mb-5">Welcome</h1>
            <p className="mb-5">
              Do not have an account?{" "}
              <Link href="/auth/signup" className="underline">Creat an account</Link>
            </p>
          </div>
          <div className="w-full">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black uppercase text-white py-2 rounded-lg hover:bg-blue-900 transition duration-300"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
