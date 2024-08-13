"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import axios from "axios";
import Payment from "@/components/Payment";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      firstName: session?.user?.firstName || "",
      lastName: session?.user?.lastName || "",
      email: session?.user?.email || "",
    }));
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const checkFieldData = () => {
    let isValid = true;
    let errorMessage = "";

    for (const key in formData) {
      if (formData[key as keyof FormData].trim() === "") {
        isValid = false;
        errorMessage += `The ${key} field is required.\n`;
      }
    }

    if (!isValid) {
      toast.error(errorMessage.trim());
    }

    return isValid;
  };

  const handleOrderSubmit = async (paymentID: string): Promise<Boolean> => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/order`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
          intent_id: paymentID,
        }
      );
      if (res.status !== 200) {
        throw new Error("Error while inserting order. Please try again! ");
      }

      toast.success("Order Inserted Successfully");
      return true;
    } catch (error) {
      toast.error("Error while inserting order. Please try again!");
      return false;
    }
  };

  return (
    <div className="h-full min-h-[calc(100vh-16rem)] flex justify-center items-center">
      <div className="max-w-4xl mx-auto p-2 w-full 2xl:w-1/2">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold inline-block border-b-[3px] pb-1 border-black">
            Checkout
          </h2>
        </div>

        <div className="mt-12">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-3xl font-bold">01</h3>
              <h3 className="text-xl font-bold mt-1">Personal Details</h3>
            </div>
            <div className="md:col-span-2">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="First name"
                    className="px-4 py-3 bg-transparent  text-black w-full text-sm border-2 rounded-md outline-none"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last name"
                    className="px-4 py-3 bg-transparent  text-black w-full text-sm border-2 rounded-md outline-none"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email address"
                    className="px-4 py-3 bg-transparent  text-black w-full text-sm border-2 rounded-md outline-none"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Phone number"
                    className="px-4 py-3 w-full text-sm border-2 rounded-md outline-none bg-transparent "
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <div>
              <h3 className="text-3xl font-bold">02</h3>
              <h3 className="text-xl font-bold mt-1">Shopping Address</h3>
            </div>
            <div className="md:col-span-2">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Street address"
                    className="px-4 py-3 w-full text-sm border-2 rounded-md outline-none bg-transparent "
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="City"
                    className="px-4 py-3 w-full text-sm border-2 rounded-md outline-none bg-transparent "
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="State"
                    className="px-4 py-3 w-full text-sm border-2 rounded-md outline-none bg-transparent "
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Zip Code"
                    className="px-4 py-3 w-full text-sm border-2 rounded-md outline-none bg-transparent "
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <div>
              <h3 className="text-3xl font-bold">03</h3>
              <h3 className="text-xl font-bold mt-1">Payment method</h3>
            </div>
            <div className="md:col-span-2">
              <Payment
                handleOrderSubmit={handleOrderSubmit}
                checkFieldData={checkFieldData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
