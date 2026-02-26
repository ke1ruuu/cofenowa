"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true)
            try {
                const { data: { user } } = await supabase.auth.getUser()
                setUser(user)
                
                if (user) {
                    const { data: profileData } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", user.id)
                        .single()
                    setProfile(profileData)
                }
            } catch (error) {
                console.error("Error fetching user/profile:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null
            setUser(currentUser)
            if (!session) {
                setProfile(null)
                setIsLoading(false)
            } else {
                // If session exists, we might need to fetch profile if it's not already there
                if (!profile) {
                    fetchUser()
                }
            }
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    return { user, profile, isLoading, supabase }
}
