"use client"

import Image from "next/image"
import { Sparkles } from "lucide-react"

interface AuthVisualProps {
    isLogin: boolean
}

export const AuthVisual = ({ isLogin }: AuthVisualProps) => (
    <div className="relative hidden w-1/2 md:block overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-[#181411]/70 via-[#181411]/20 to-transparent" />
        <Image
            src={isLogin ? "/images/image12.jpg" : "/images/pastries2.jpg"}
            alt="NOWA CAFE Ambience"
            fill
            className="object-cover"
            priority
        />
        
        <div className="absolute bottom-12 left-12 right-12 z-30">
            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-xl border border-white/20 shadow-2xl">
                <Sparkles className="h-6 w-6 text-[#f27f0d] mb-4 opacity-50" />
                <p className="text-2xl font-black text-white leading-tight italic">
                    {isLogin 
                        ? '"The best coffee in the city, hands down. The atmosphere is as warm as the brew."' 
                        : '"More than just coffee. It\'s the morning ritual that sets the mood for my day."'}
                </p>
                <div className="mt-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#f27f0d] p-0.5 overflow-hidden">
                        <div className="h-full w-full rounded-full bg-white/20 backdrop-blur-md" />
                    </div>
                    <div>
                        <p className="font-black text-white">{isLogin ? "Sarah Jenkins" : "David Miller"}</p>
                        <p className="text-sm font-bold text-white/60 uppercase tracking-wider">
                            {isLogin ? "Coffee Connoisseur" : "Lifestyle Blogger"}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className={`absolute top-10 z-30 flex items-center gap-2 ${isLogin ? 'left-10' : 'right-10'}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30">
                <Image
                    src="/images/cofenowa/android-chrome-192x192.png"
                    alt="Logo"
                    width={24}
                    height={24}
                    className="rounded-md"
                />
            </div>
            <h2 className="text-xl font-black tracking-tight text-white drop-shadow-lg">NOWA CAFE</h2>
        </div>
    </div>
)
