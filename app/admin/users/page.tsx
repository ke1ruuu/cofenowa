import { createClient } from "@/utils/supabase/server"
import { UserManagement } from "@/components/admin/UserManagement"

export default async function UsersPage() {
    const supabase = await createClient()
    
    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) {
        return (
            <div className="rounded-3xl bg-red-50 p-8 text-center text-red-500">
                <h2 className="text-xl font-black">Error Loading Users</h2>
                <p className="mt-2 text-sm">{error.message}</p>
            </div>
        )
    }

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">User Management</h1>
                    <p className="mt-2 text-[#8a7560] font-medium">Manage permissions and oversee your coffee community.</p>
                </div>
            </div>

            <UserManagement initialProfiles={profiles || []} />
        </div>
    )
}
