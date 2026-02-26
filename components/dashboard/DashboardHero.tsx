"use client"

import { Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeroProps {
    userName: string
}

export function DashboardHero({ userName }: DashboardHeroProps) {
    return (
        <div className="mb-12 overflow-hidden rounded-[3rem] bg-[#181411] p-8 md:p-16 relative">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#f27f0d]/20 to-transparent pointer-events-none" />
            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f27f0d]/10 px-4 py-2 border border-[#f27f0d]/20 mb-6">
                    <Star className="h-4 w-4 text-[#f27f0d] fill-[#f27f0d]" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#f27f0d]">Member Exclusive</span>
                </div>
                <h1 className="text-4xl font-black text-white md:text-6xl mb-4 leading-none tracking-tight">
                    Welcome back, <br />
                    <span className="text-[#f27f0d]">{userName}</span>
                </h1>
                <p className="max-w-md text-lg text-white/60 mb-8 font-medium">
                    Ready for your regular brew? We've prepared something special for you today.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Button className="h-14 bg-[#f27f0d] hover:bg-[#f27f0d]/90 rounded-2xl px-8 font-bold text-lg group">
                        Order Now
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <div className="text-right">
                             <p className="text-[10px] uppercase font-black tracking-widest text-white/40">My Points</p>
                             <p className="text-xl font-black text-white">450 <span className="text-[#f27f0d]">★</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
