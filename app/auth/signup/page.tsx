"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default function LoginPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (firstName === "" || lastName === "") {
        throw new Error(
          "First and last names cannot be left empty. Please fill them in!"
        );
      }

      if (!isValidEmail(email)) {
        throw new Error(
          "Oops! That doesn't look like a valid email address. Please check and try again."
        );
      }

      if (password !== confirmPassword) {
        throw new Error(
          "Passwords do not match. Please ensure both password fields are the same."
        );
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/signup`, {
        firstName,
        lastName,
        email,
        password,
      });

      toast.success(
        "🎉 Hooray! You have successfully registered. Welcome aboard! 🎉"
      );
      router.push(`/login`);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again!");
    }
  };

  return (
    <div className="p-4 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex items-center justify-center">
      {/* BOX */}
      <div className="h-[80%] w-[90vw] shadow-2xl rounded-md flex flex-col md:flex-row md:h-[90%] md:w-full lg:w-[60%] 2xl:w-2/3">
        {/* IMAGE CONTAINER */}
        <div className=" relative h-2/3 w-full md:h-full md:w-1/2">
          <Image src="/loginBg.png" alt="" fill className="object-cover" />
        </div>
        {/* FORM CONTAINER */}
        <div className="p-5 md:p-10 flex flex-col gap-8 md:w-1/2 ">
          <div className="w-full">
            <h1 className="font-bold text-xl xl:text-3xl mb-5">Welcome</h1>
            <p className="mb-5">
              Already have an account? <Link href="/auth/login">Login</Link>
            </p>
          </div>
          <div className="w-full">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="firstName"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFirstName(e.target.value)
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="lastName"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLastName(e.target.value)
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Email
                </label>
                <input
                  type="text"
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
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black uppercase text-white py-2 rounded-lg hover:bg-blue-900 transition duration-300"
              >
                SIGN UP
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
