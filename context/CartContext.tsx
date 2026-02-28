"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  milk?: string;
  sweetness?: string;
  addonDisplay?: string;
  quantity: number;
  totalPrice: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (index: number, newQuantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on init
  useEffect(() => {
    const savedCart = localStorage.getItem("nowa-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("nowa-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (i) =>
          i.id === item.id &&
          i.size === item.size &&
          i.addonDisplay === item.addonDisplay,
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prev];
        const existingItem = updatedCart[existingItemIndex];
        const newQuantity = existingItem.quantity + item.quantity;
        updatedCart[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: (existingItem.price * newQuantity).toFixed(2),
        };
        return updatedCart;
      }

      return [...prev, item];
    });
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    setCart((prev) => {
      if (newQuantity <= 0) return prev.filter((_, i) => i !== index);
      const updatedCart = [...prev];
      const item = updatedCart[index];
      updatedCart[index] = {
        ...item,
        quantity: newQuantity,
        totalPrice: (item.price * newQuantity).toFixed(2),
      };
      return updatedCart;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + parseFloat(item.totalPrice),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
