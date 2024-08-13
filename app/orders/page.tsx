import React, { Fragment } from "react";
import { auth } from "../_lib/auth";
import { redirect } from "next/navigation";
import axios from "axios";
import OrderStatus from "../../components/OrderStatus";

async function getOrders(email: string | null | undefined) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/order/getMyOrders`,
      {
        email,
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export default async function OrderPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const data = await getOrders(session.user?.email);

  return (
    <div className="p-4 xl:p-40">
      <table className="w-full border-separate border-spacing-3">
        <thead>
          <tr className="text-left">
            <th>Order ID</th>
            <th className="hidden lg:block">Date</th>
            <th>Price</th>
            <th className="hidden lg:block">Product</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any) => (
            <tr
              className="text-sm md:text-base odd:bg-gray-300"
              key={item.orderID}
            >
              <td className="py-6 px-1 uppercase">{item.orderID}</td>
              <td className="py-6 px-1">
                {item.date.split(",")[0]} <br /> {item.date.split(",")[1]}{" "}
              </td>
              <td className="py-6 px-1">€ {item.totalPrice}</td>
              <td className="hidden lg:block py-6 px-1">
                {item.products.map((product: any) => (
                  <Fragment key={product.name}>
                    {product.name} - {"("}
                    {product.quantity}
                    {")"}
                    <br />
                  </Fragment>
                ))}
              </td>
              <OrderStatus preparationTime={item.date} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
