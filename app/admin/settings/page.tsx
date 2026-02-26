import { createClient } from "@/utils/supabase/server"
import { SettingsInterface } from "@/components/admin/SettingsInterface"

export default async function AdminSettingsPage() {
    const supabase = await createClient()
    
    const { data: settings, error } = await supabase
        .from("store_settings")
        .select("*")

    if (error) {
        return (
            <div className="rounded-3xl bg-red-50 p-8 text-center text-red-500">
                <h2 className="text-xl font-black">Error Loading Settings</h2>
                <p className="mt-2 text-sm">{error.message}</p>
            </div>
        )
    }

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-black tracking-tight text-[#181411]">Store Command Center</h1>
                <p className="text-[#8a7560] font-medium mt-2">Fine-tune your cafe operations and global configurations.</p>
            </div>

            <SettingsInterface settings={settings || []} />
        </div>
    )
}
