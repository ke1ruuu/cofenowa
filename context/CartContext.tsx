"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type CartItem = {
    id: string
    name: string
    price: number
    image: string
    size: string
    milk?: string
    sweetness?: string
    addonDisplay?: string
    quantity: number
    totalPrice: string
}

type CartContextType = {
    cart: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (index: number) => void
    clearCart: () => void
    totalItems: number
    totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])

    // Load cart from localStorage on init
    useEffect(() => {
        const savedCart = localStorage.getItem("nowa-cart")
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart))
            } catch (e) {
                console.error("Failed to load cart", e)
            }
        }
    }, [])

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem("nowa-cart", JSON.stringify(cart))
    }, [cart])

    const addToCart = (item: CartItem) => {
        setCart((prev) => [...prev, item])
    }

    const removeFromCart = (index: number) => {
        setCart((prev) => prev.filter((_, i) => i !== index))
    }

    const clearCart = () => {
        setCart([])
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0)

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
