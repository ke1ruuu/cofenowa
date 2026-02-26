"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Menu as MenuIcon, LogOut } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useState } from "react"
import { signOut } from "@/app/login/actions"
import { useAuth } from "@/hooks/useAuth"
import { useStoreSettings } from "@/hooks/useStoreSettings"
import { CartDrawer } from "@/components/layout/Header/CartDrawer"
import { MobileNav } from "@/components/layout/Header/MobileNav"

export default function Header() {
    const { totalItems } = useCart()
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, profile } = useAuth()
    const { storeInfo } = useStoreSettings()

    const navLinks = user ? [
        ...(profile?.role === "admin" ? [{ name: "Admin", href: "/admin" }] : []),
        { name: "Dashboard", href: "/home" },
        { name: "Menu", href: "/menu" },
        { name: "Orders", href: "/orders" },
        { name: "Rewards", href: "/rewards" },
    ] : [
        { name: "Menu", href: "/menu" },
        { name: "About Us", href: "/about" },
        { name: "Gallery", href: "/gallery" },
        { name: "Contact", href: "/contact" },
    ]

    return (
        <>
            {storeInfo.announcement && (
                <div className="bg-[#181411] py-3 px-4 text-center">
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white/90 animate-in fade-in slide-in-from-top duration-500">
                        ✨ {storeInfo.announcement} ✨
                    </p>
                </div>
            )}
            <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
                user 
                ? "bg-white/95 border-[#e6e0db] shadow-sm backdrop-blur-md" 
                : "bg-[#f8f7f5]/80 border-[#e6e0db] backdrop-blur-md"
            }`}>
                <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-10">
                    <div className="flex items-center gap-6">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8f7f5] shadow-sm transition-transform hover:scale-105 active:scale-95 md:hidden"
                        >
                            <MenuIcon className="h-5 w-5 text-[#181411]" />
                        </button>

                        <Link href={user ? "/home" : "/"} className="flex items-center gap-3 group">
                            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[#f27f0d] p-1.5 transition-transform group-hover:rotate-6">
                                <Image
                                    src="/images/cofenowa/android-chrome-192x192.png"
                                    alt="Logo"
                                    width={32}
                                    height={32}
                                    className="h-full w-full invert"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-lg font-black leading-none tracking-tight">
                                    NOWA CAFE
                                </h1>
                                {user && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#f27f0d]">Member</span>
                                )}
                            </div>
                        </Link>
                    </div>

                    <nav className="hidden items-center gap-1 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    user 
                                    ? "text-[#8a7560] hover:text-[#181411] hover:bg-[#f8f7f5]" 
                                    : "text-[#8a7560] hover:text-[#f27f0d]"
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        {user && (
                            <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f27f0d]/5 border border-[#f27f0d]/10 mr-2">
                                <div className="h-2 w-2 rounded-full bg-[#f27f0d] animate-pulse" />
                                <span className="text-xs font-black text-[#f27f0d]">450 PTS</span>
                            </div>
                        )}

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-[#e6e0db] shadow-sm transition-all hover:scale-105 hover:border-[#f27f0d]/30 active:scale-95"
                        >
                            <ShoppingBag className="h-5 w-5 text-[#181411]" />
                            {totalItems > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#f27f0d] text-[10px] font-black text-white shadow-lg border-2 border-white">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        <div className="h-8 w-px bg-[#e6e0db] mx-2 hidden sm:block" />

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link 
                                    href="/profile" 
                                    className="flex h-11 items-center gap-3 rounded-xl bg-[#f8f7f5] px-2 pr-4 transition-all hover:bg-[#181411] hover:text-white group"
                                >
                                    <div className="h-7 w-7 rounded-lg bg-[#f27f0d] flex items-center justify-center text-white font-black text-xs">
                                        {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-xs font-black truncate max-w-[80px]">
                                            {profile?.full_name?.split(' ')[0] || "Member"}
                                        </p>
                                    </div>
                                </Link>
                                <form action={signOut}>
                                    <button 
                                        type="submit" 
                                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-red-50 text-red-400 shadow-sm transition-all hover:bg-red-50 hover:text-red-600 active:scale-95"
                                        title="Sign Out"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <Link href="/login?mode=signup" className="hidden sm:block">
                                <Button className="h-11 bg-[#f27f0d] hover:bg-[#f27f0d]/90 rounded-xl px-6 font-black transition-all active:scale-95 shadow-lg shadow-[#f27f0d]/20">
                                    Get Started
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <MobileNav 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
                user={user} 
                profile={profile} 
                navLinks={navLinks} 
            />

            <CartDrawer 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
            />
        </>
    )
}
