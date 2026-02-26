"use client"

import { X, Plus, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { signOut } from "@/app/login/actions"
import type { User } from "@supabase/supabase-js"

interface MobileNavProps {
    isOpen: boolean
    onClose: () => void
    user: User | null
    profile: any
    navLinks: Array<{ name: string, href: string }>
}

export function MobileNav({ isOpen, onClose, user, profile, navLinks }: MobileNavProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[110] md:hidden">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
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
                        onClick={onClose}
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
                                onClick={onClose}
                                className="flex items-center justify-between rounded-2xl bg-[#f8f7f5] p-5 text-lg font-black transition-all hover:bg-[#f27f0d] hover:text-white"
                            >
                                {link.name}
                                <Plus className="h-5 w-5 opacity-20" />
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-auto pt-6 border-t border-[#f2ede8]">
                        {user ? (
                            <div className="space-y-6">
                                <div className="flex flex-col gap-4 p-6 rounded-[2rem] bg-[#f8f7f5] border border-[#e6e0db]">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-[#f27f0d] flex items-center justify-center text-white text-xl font-black">
                                            {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-black truncate text-lg">{profile?.full_name || "Member"}</p>
                                            <p className="text-xs font-bold text-[#f27f0d] uppercase tracking-widest">Premium Member</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-[#e6e0db]">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-[#f27f0d]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#8a7560]">Points Balance</span>
                                        </div>
                                        <span className="text-sm font-black">450 PTS</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <Link href="/profile" onClick={onClose} className="w-full">
                                        <Button variant="outline" className="w-full h-14 rounded-2xl border-[#e6e0db] font-black hover:bg-[#181411] hover:text-white transition-all">
                                            View Profile
                                        </Button>
                                    </Link>
                                    <form action={signOut} className="w-full">
                                        <Button variant="outline" className="w-full h-14 rounded-2xl border-red-50 text-red-500 hover:bg-red-50 font-black transition-all">
                                            Sign Out
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login?mode=signup" onClick={onClose}>
                                <Button className="h-16 w-full rounded-[2rem] bg-[#f27f0d] text-lg font-black transition-all active:scale-95 shadow-lg shadow-[#f27f0d]/20">
                                    Get Started
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
