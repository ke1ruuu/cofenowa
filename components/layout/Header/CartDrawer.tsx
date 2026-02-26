"use client"

import { ShoppingBag, X, Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/context/CartContext"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createOrder } from "@/app/orders/actions"
import { Loader2 } from "lucide-react"

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { cart, totalItems, totalPrice, removeFromCart, addToCart, clearCart } = useCart()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleCheckout = async () => {
        setIsLoading(true)
        setError(null)
        
        try {
            const finalTotal = totalPrice * 1.08 // Subtotal + 8% tax
            const result = await createOrder(cart, finalTotal)

            if (result.success) {
                clearCart()
                onClose()
                router.push("/orders")
            } else {
                setError(result.error || "Something went wrong")
            }
        } catch (err) {
            setError("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
            <div
                className="fixed inset-0 h-full w-full"
                onClick={onClose}
            />
            <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-[#f2ede8] p-6">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="h-6 w-6 text-[#f27f0d]" />
                        <h2 className="text-xl font-black">Your Order</h2>
                        <span className="rounded-full bg-[#f8f7f5] px-2 py-1 text-xs font-bold text-[#8a7560]">
                            {totalItems} items
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f7f5] text-[#8a7560] transition-colors hover:bg-[#181411] hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="mb-4 rounded-xl bg-red-50 p-4 text-xs font-bold text-red-500 border border-red-100 italic">
                            {error}
                        </div>
                    )}
                    
                    {cart.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f8f7f5] text-[#e6e0db]">
                                <ShoppingBag className="h-10 w-10" />
                            </div>
                            <h3 className="text-lg font-bold">Your cart is empty</h3>
                            <p className="mt-2 text-sm text-[#8a7560]">
                                Looks like you haven't added anything to your brew list yet.
                            </p>
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="mt-8 border-[#e6e0db] rounded-xl font-bold"
                                asChild
                            >
                                <Link href="/menu">Explore Menu</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cart.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="flex gap-4">
                                    <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-[#e6e0db] bg-[#f8f7f5]">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex flex-1 flex-col">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-bold">{item.name}</h4>
                                                <p className="text-[10px] uppercase tracking-wider text-[#8a7560] leading-relaxed">
                                                    {item.size}{item.addonDisplay ? ` • ${item.addonDisplay}` : ''}
                                                </p>
                                            </div>
                                            <span className="font-bold text-[#f27f0d]">${item.totalPrice}</span>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex items-center gap-3 rounded-lg bg-[#f8f7f5] p-1 border border-[#f2ede8]">
                                                <button
                                                    onClick={() => {
                                                        const newQuantity = Math.max(0, item.quantity - 1);
                                                        removeFromCart(index);
                                                        if (newQuantity > 0) {
                                                            addToCart({ ...item, quantity: newQuantity, totalPrice: (item.price * newQuantity).toFixed(2) });
                                                        }
                                                    }}
                                                    className="flex h-6 w-6 items-center justify-center rounded bg-white shadow-sm border border-[#e6e0db]"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => {
                                                        const newQuantity = item.quantity + 1;
                                                        removeFromCart(index);
                                                        addToCart({ ...item, quantity: newQuantity, totalPrice: (item.price * newQuantity).toFixed(2) });
                                                    }}
                                                    className="flex h-6 w-6 items-center justify-center rounded bg-white shadow-sm border border-[#e6e0db]"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(index)}
                                                className="text-[#e6e0db] transition-colors hover:text-red-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Drawer Footer */}
                {cart.length > 0 && (
                    <div className="border-t border-[#f2ede8] bg-[#f8f7f5]/50 p-6">
                        <div className="mb-6 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#8a7560]">Subtotal</span>
                                <span className="font-bold">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#8a7560]">Estimated Tax (8%)</span>
                                <span className="font-bold">${(totalPrice * 0.08).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t border-[#e6e0db] pt-4 text-xl">
                                <span className="font-black">Total</span>
                                <span className="font-black text-[#f27f0d]">
                                    ${(totalPrice * 1.08).toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <Button 
                            disabled={isLoading}
                            onClick={handleCheckout}
                            className="h-14 w-full bg-[#181411] text-lg font-bold hover:bg-[#181411]/90 rounded-2xl shadow-lg transition-all active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                "Place Order"
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
