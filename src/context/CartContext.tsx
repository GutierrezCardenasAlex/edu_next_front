// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  instructor: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (course: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (course: any) => {
    setCart((prev) => {
      if (prev.find((i) => i.id === course.id)) {
        alert("Ya tienes este curso en el carrito");
        return prev;
      }
      return [...prev, {
        id: course.id,
        title: course.title,
        price: course.price,
        image: course.image,
        instructor: course.instructor,
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, i) => sum + i.price, 0);
  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};