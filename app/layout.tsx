import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Notification from "@/components/Notification";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "./_lib/auth";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wahid Pizzeria",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sesssion = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <CartProvider>
            <Notification />
            <Navbar />
            {children}
            <Footer />
            <ToastContainer />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
