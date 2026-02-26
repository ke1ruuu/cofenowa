"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth/AuthForm"
import { AuthVisual } from "@/components/auth/AuthVisual"

function AuthContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    
    const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "signup")
    const [isTransitioning, setIsTransitioning] = useState(false)
    const isFirstRender = useRef(true)

    useEffect(() => {
        const checkUser = async () => {
            const { createClient } = await import("@/utils/supabase/client")
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            
            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .maybeSingle()
                
                if (profile?.role?.toLowerCase() === "admin") {
                    router.push("/admin")
                } else {
                    router.push("/home")
                }
            }
        }
        checkUser()
    }, [router])


    useEffect(() => {
        const mode = searchParams.get("mode")
        const targetMode = mode !== "signup"
        
        if (isFirstRender.current) {
            setIsLogin(targetMode)
            isFirstRender.current = false
            return
        }

        if (targetMode !== isLogin) {
            setIsTransitioning(true)
            const timer = setTimeout(() => {
                setIsLogin(targetMode)
                setIsTransitioning(false)
            }, 400) // Balanced dissolve timing
            return () => clearTimeout(timer)
        }
    }, [searchParams, isLogin])

    const toggleMode = () => {
        const newMode = isLogin ? "signup" : "login"
        router.push(`/login?mode=${newMode}`, { scroll: false })
    }

    return (
        <div className="relative min-h-screen w-full bg-[#f8f7f5] overflow-hidden">
            {/* Login Layer */}
            <div 
                className={`absolute inset-0 flex transition-all duration-500 ease-in-out ${
                    isLogin && !isTransitioning ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-[1.005] pointer-events-none"
                }`}
            >
                <AuthForm isLogin={true} onToggle={toggleMode} />
                <AuthVisual isLogin={true} />
            </div>

            {/* Register Layer */}
            <div 
                className={`absolute inset-0 flex transition-all duration-500 ease-in-out md:flex-row-reverse flex-col ${
                    !isLogin && !isTransitioning ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-[1.005] pointer-events-none"
                }`}
            >
                <AuthForm isLogin={false} onToggle={toggleMode} />
                <AuthVisual isLogin={false} />
            </div>

            {/* Static background to prevent flicker */}
            <div className="fixed inset-0 bg-[#f8f7f5] -z-10" />
        </div>
    )
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f8f7f5]" />}>
            <AuthContent />
        </Suspense>
    )
}
