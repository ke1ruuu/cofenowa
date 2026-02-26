"use client"

import { Button } from "@/components/ui/button"
import { Mail, Facebook } from "lucide-react"
import { signInWithGoogle, signInWithFacebook } from "@/app/login/actions"

export function SocialLogin() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Button 
                variant="outline" 
                type="button"
                onClick={() => signInWithGoogle()}
                className="h-12 border-[#e6e0db] hover:bg-white rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all hover:border-[#f27f0d]/40"
            >
                <Mail className="h-4 w-4 text-[#f27f0d]" />
                <span className="text-xs font-bold uppercase tracking-widest">Google</span>
            </Button>
            <Button 
                variant="outline" 
                type="button"
                onClick={() => signInWithFacebook()}
                className="h-12 border-[#e6e0db] hover:bg-white rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all hover:border-[#f27f0d]/40"
            >
                <Facebook className="h-4 w-4 text-[#1877F2]" />
                <span className="text-xs font-bold uppercase tracking-widest">Facebook</span>
            </Button>
        </div>
    )
}
