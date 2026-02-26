"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Loader2 } from "lucide-react"
import { signup, login } from "@/app/login/actions"
import { SocialLogin } from "./SocialLogin"
import { AuthFields } from "./AuthFields"

interface AuthFormProps {
    isLogin: boolean
    onToggle: () => void
}

export const AuthForm = ({ isLogin, onToggle }: AuthFormProps) => {
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)
        setMessage(null)
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        
        try {
            const result = isLogin ? await login(formData) : await signup(formData)
            
            if (result && 'error' in result && result.error) {
                setError(result.error)
            } else if (result && 'redirectTo' in result && result.redirectTo) {
                // Force a full page reload to the new path to ensure all sessions are fresh
                window.location.href = result.redirectTo
                return 
            } else if (result && 'message' in result && result.message) {
                setMessage(result.message)
            }
        } catch (err) {
            setError("Something went wrong. Please try again.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex w-full flex-col md:w-1/2">
            <div className="relative flex flex-1 items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    <div className="space-y-3 mb-8">
                        <Link href="/" className="inline-flex mb-4 group transition-transform hover:scale-105 active:scale-95">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f27f0d]/10 border border-[#f27f0d]/20 shadow-sm overflow-hidden p-1.5">
                                <Image
                                    src="/images/cofenowa/android-chrome-192x192.png"
                                    alt="NOWA CAFE Logo"
                                    width={32}
                                    height={32}
                                    className="rounded-lg h-full w-full object-cover"
                                />
                            </div>
                        </Link>
                        <h2 className="text-5xl font-black tracking-tighter text-[#181411] leading-none">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h2>
                        <p className="text-[#8a7560] font-medium text-lg">
                            {isLogin 
                                ? "Your favorite brew is just a sign-in away." 
                                : "Join our community of coffee lovers today."}
                        </p>
                    </div>

                    <SocialLogin />

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-[#e6e0db]" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase">
                            <span className="bg-[#f8f7f5] px-4 text-[#8a7560] font-black tracking-[0.2em] leading-none">
                                secure email {isLogin ? "access" : "registration"}
                            </span>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-bold">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AuthFields isLogin={isLogin} />

                        {isLogin && (
                            <div className="flex justify-end pr-1">
                                <button type="button" className="text-xs font-black text-[#f27f0d] hover:underline transition-all uppercase tracking-wider">
                                    Recover Access?
                                </button>
                            </div>
                        )}

                        <Button 
                            type="submit"
                            disabled={isLoading}
                            className="h-14 w-full rounded-2xl bg-[#f27f0d] text-lg font-bold hover:bg-[#f27f0d]/90 text-white mt-4 group shadow-lg shadow-[#f27f0d]/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? "Login" : "Register"}
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm font-medium text-[#8a7560]">
                        {isLogin ? "New to the community?" : "Already one of us?"}{" "}
                        <button
                            type="button"
                            onClick={onToggle}
                            className="font-black text-[#181411] hover:text-[#f27f0d] transition-colors underline decoration-[#f27f0d]/30 decoration-2 underline-offset-4"
                        >
                            {isLogin ? "Join for free" : "Sign back in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

