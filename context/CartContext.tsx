"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

// Define the CartItem interface
interface CartItem {
  id: string;
  quantity: number;
  name: string;
  totalPrice: number;
  size: string;
  img: string;
}

// Define the CartState interface
interface CartState {
  cartArray: CartItem[];
}

// Define the CartContextType interface
interface CartContextType {
  cart: CartState;
  addToCart: (
    id: string,
    selectedQuantity: number,
    size: string
  ) => Promise<void>;
  removeFromCart: (id: string, size: string) => Promise<void>;
  updateCart: (
    id: string,
    selectedQuantity: number,
    size: string
  ) => Promise<void>;
  emptyCart: () => void;
}

// Create the CartContext with an initial undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Define the initial state for the cart
const initialState: CartState = { cartArray: [] };

// Define the CartProvider component
function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(initialState);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      (async () => {
        await getCart();
      })();
    }
  }, [session]);

  const getCart = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_DOMAIN}/cart`);
      if (res.status === 200) {
        setCart((prev) => {
          return {
            ...prev,
            cartArray: res.data.cartArray,
          };
        });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Error fetching cart data");
    }
  };

  const addToCart = async (
    id: string,
    selectedQuantity: number,
    size: string
  ) => {
    try {
      const alreadyInCart = cart.cartArray.some(
        (item: CartItem) => item.id === id && item.size === size
      );

      if (alreadyInCart) {
        await updateCart(id, selectedQuantity, size);
        return;
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/cart`,
        {
          product: id,
          quantity: selectedQuantity,
          size,
        }
      );

      if (res.status !== 200) {
        throw new Error("Error while adding product to cart");
      }

      await getCart();
      toast.success("Product added to cart successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error while adding product to cart");
    }
  };

  const removeFromCart = async (id: string, size: string) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/cart`,
        {
          data: {
            product: id,
            size,
          },
        }
      );

      if (res.status !== 200) {
        throw new Error("Error while removing data from cart");
      }

      setCart((prev) => ({
        ...prev,
        cartArray: prev.cartArray.filter(
          (item) =>
            !(item.id === id && item.size.toLowerCase() === size.toLowerCase())
        ),
      }));
      toast.success("Product removed from cart successfully");
    } catch (error) {
      console.error("Error while removing data from cart:", error);
      toast.error("Error while removing data from cart");
    }
  };

  const updateCart = async (
    id: string,
    selectedQuantity: number,
    size: string
  ) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/cart`,
        {
          product: id,
          quantity: selectedQuantity,
          size,
        }
      );

      if (res.status !== 200) {
        throw new Error("Error while updating product in cart");
      }

      await getCart();
      toast.success("Cart updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error while updating product in cart");
    }
  };

  const emptyCart = async () => {
    setCart(initialState);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, emptyCart, removeFromCart, updateCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Define the useCart hook for accessing the cart context
function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}

export { CartProvider, useCart };
