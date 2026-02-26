"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

export function useStoreSettings() {
    const [settings, setSettings] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true)
            try {
                const { data } = await supabase
                    .from("store_settings")
                    .select("*")
                if (data) setSettings(data)
            } catch (error) {
                console.error("Error fetching store settings:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSettings()

        // Real-time updates
        const channel = supabase
            .channel("store_settings_changes")
            .on(
                "postgres_changes",
                { event: "*", table: "store_settings", schema: "public" },
                () => fetchSettings()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    const getSetting = (key: string) => settings.find(s => s.key === key)?.value || {}

    return {
        settings,
        isLoading,
        getSetting,
        storeInfo: getSetting("store_info"),
        operationalStatus: getSetting("operational_status"),
        rewardSettings: getSetting("reward_settings")
    }
}
