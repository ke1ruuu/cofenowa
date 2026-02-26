"use client"

import { Input } from "@/components/ui/input"
import { User, AtSign, Lock } from "lucide-react"

interface AuthFieldsProps {
    isLogin: boolean
}

export function AuthFields({ isLogin }: AuthFieldsProps) {
    return (
        <div className="space-y-5">
            {!isLogin && (
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8a7560] ml-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 h-4 w-4 text-[#8a7560]" />
                        <Input 
                            name="full_name"
                            type="text" 
                            placeholder="John Doe" 
                            required
                            className="h-13 pl-12 rounded-2xl border-[#e6e0db] bg-white focus:ring-[#f27f0d] focus:border-[#f27f0d] shadow-sm text-sm" 
                        />
                    </div>
                </div>
            )}
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8a7560] ml-1">Email Address</label>
                <div className="relative">
                    <AtSign className="absolute left-4 top-3.5 h-4 w-4 text-[#8a7560]" />
                    <Input 
                        name="email"
                        type="email" 
                        placeholder="hello@nowacafe.com" 
                        required
                        className="h-13 pl-12 rounded-2xl border-[#e6e0db] bg-white focus:ring-[#f27f0d] focus:border-[#f27f0d] shadow-sm text-sm" 
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8a7560] ml-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-4 w-4 text-[#8a7560]" />
                    <Input 
                        name="password"
                        type="password" 
                        placeholder="••••••••" 
                        required
                        className="h-13 pl-12 rounded-2xl border-[#e6e0db] bg-white focus:ring-[#f27f0d] focus:border-[#f27f0d] shadow-sm text-sm" 
                    />
                </div>
            </div>
        </div>
    )
}
