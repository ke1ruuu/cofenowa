"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, X, Trash2, Plus, Minus, Menu as MenuIcon } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useState } from "react"

export default function Header() {
    const { cart, totalItems, totalPrice, removeFromCart, addToCart } = useCart()
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navLinks = [
        { name: "Menu", href: "/menu" },
        { name: "About Us", href: "/about" },
        { name: "Gallery", href: "/gallery" },
        { name: "Contact", href: "/contact" },
    ]

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-[#e6e0db] bg-[#f8f7f5]/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-10">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-105 active:scale-95 md:hidden"
                        >
                            <MenuIcon className="h-5 w-5 text-[#181411]" />
                        </button>

                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/images/cofenowa/android-chrome-192x192.png"
                                alt="NOWA CAFE Logo"
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-lg"
                            />
                            <h1 className="text-xl font-black leading-tight tracking-tight">
                                NOWA CAFE
                            </h1>
                        </Link>
                    </div>

                    <nav className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-semibold transition-colors hover:text-[#f27f0d]"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-105 active:scale-95"
                        >
                            <ShoppingBag className="h-5 w-5 text-[#181411]" />
                            {totalItems > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f27f0d] text-[10px] font-bold text-white shadow-sm">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                        <Link href="/contact" className="hidden sm:block">
                            <Button className="bg-[#f27f0d] hover:bg-[#f27f0d]/90">
                                Find Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[110] md:hidden">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="relative flex h-full w-[80%] max-w-sm flex-col bg-white shadow-2xl animate-in slide-in-from-left duration-300">
                        <div className="flex items-center justify-between border-b border-[#f2ede8] p-6">
                            <div className="flex items-center gap-3">
                                <Image
                                    src="/images/cofenowa/android-chrome-192x192.png"
                                    alt="NOWA CAFE Logo"
                                    width={24}
                                    height={24}
                                    className="rounded-md"
                                />
                                <h2 className="text-lg font-black">NOWA CAFE</h2>
                            </div>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f7f5] text-[#8a7560]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                            <nav className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-between rounded-2xl bg-[#f8f7f5] p-5 text-lg font-black transition-all hover:bg-[#f27f0d] hover:text-white"
                                    >
                                        {link.name}
                                        <Plus className="h-5 w-5 opacity-20" />
                                    </Link>
                                ))}
                            </nav>
                            <div className="mt-auto">
                                <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                                    <Button className="h-14 w-full rounded-2xl bg-[#f27f0d] text-lg font-bold">
                                        Find Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Drawer Overlay */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
                    <div
                        className="fixed inset-0 h-full w-full"
                        onClick={() => setIsCartOpen(false)}
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
                                onClick={() => setIsCartOpen(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f7f5] text-[#8a7560] transition-colors hover:bg-[#181411] hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-6">
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
                                        onClick={() => { setIsCartOpen(false); }}
                                        className="mt-8 bg-[#f27f0d]"
                                    >
                                        <Link href="/menu">Explore Menu</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cart.map((item, index) => (
                                        <div key={`${item.id}-${index}`} className="flex gap-4">
                                            <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-[#f8f7f5]">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex flex-1 flex-col">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-bold">{item.name}</h4>
                                                        <p className="text-[10px] uppercase tracking-wider text-[#8a7560]">
                                                            {item.size} • {item.milk || 'No Milk'}
                                                        </p>
                                                    </div>
                                                    <span className="font-bold text-[#f27f0d]">${item.totalPrice}</span>
                                                </div>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <div className="flex items-center gap-3 rounded-lg bg-[#f8f7f5] p-1">
                                                        <button
                                                            onClick={() => {
                                                                if (item.quantity > 1) {
                                                                    removeFromCart(index);
                                                                    addToCart({ ...item, quantity: item.quantity - 1, totalPrice: (item.price * (item.quantity - 1)).toFixed(2) });
                                                                } else {
                                                                    removeFromCart(index);
                                                                }
                                                            }}
                                                            className="flex h-6 w-6 items-center justify-center rounded bg-white shadow-sm"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="text-xs font-bold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => {
                                                                removeFromCart(index);
                                                                addToCart({ ...item, quantity: item.quantity + 1, totalPrice: (item.price * (item.quantity + 1)).toFixed(2) });
                                                            }}
                                                            className="flex h-6 w-6 items-center justify-center rounded bg-white shadow-sm"
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
                                        <span className="text-[#8a7560]">Taxes</span>
                                        <span className="font-bold">${(totalPrice * 0.08).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-[#e6e0db] pt-4 text-xl">
                                        <span className="font-black">Total</span>
                                        <span className="font-black text-[#f27f0d]">
                                            ${(totalPrice * 1.08).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <Button className="h-14 w-full bg-[#181411] text-lg font-bold hover:bg-black">
                                    Checkout Now
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
