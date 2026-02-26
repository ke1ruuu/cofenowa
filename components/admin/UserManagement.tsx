"use client"

import { useState } from "react"
import { Users, Search, MoreVertical, Shield, User, Trash2, Calendar, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateUserRole, deleteUser } from "@/app/admin/actions"
import { cn } from "@/lib/utils"

interface Profile {
    id: string
    full_name: string | null
    email: string
    phone: string | null
    role: string
    created_at: string
}

interface UserManagementProps {
    initialProfiles: Profile[]
}

export function UserManagement({ initialProfiles }: UserManagementProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<"customers" | "admins">("customers")

    const filteredProfiles = initialProfiles.filter(p => 
        p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const admins = filteredProfiles.filter(p => p.role === "admin")
    const customers = filteredProfiles.filter(p => p.role !== "admin")

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        setIsLoading(userId)
        setActiveMenu(null)
        try {
            const result = await updateUserRole(userId, newRole)
            if (result?.error) alert(result.error)
        } catch (e) {
            alert("Failed to update role")
        } finally {
            setIsLoading(null)
        }
    }

    const handleDelete = async (userId: string) => {
        setActiveMenu(null)
        if (!confirm("Are you sure you want to delete this user profile? This action cannot be undone.")) return
        
        setIsLoading(userId)
        try {
            const result = await deleteUser(userId)
            if (result?.error) alert(result.error)
        } catch (e) {
            alert("Failed to delete user")
        } finally {
            setIsLoading(null)
        }
    }

    const totalUsers = initialProfiles.length
    const adminCount = initialProfiles.filter(p => p.role === "admin").length
    const customerCount = totalUsers - adminCount

    const UserTable = ({ users, roleLabel }: { users: Profile[], roleLabel: string }) => (
        <div className="overflow-hidden bg-white">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#f8f7f5] text-[10px] font-black uppercase tracking-widest text-[#8a7560]">
                            <th className="px-8 py-5">Profile</th>
                            <th className="px-8 py-5">Contact</th>
                            <th className="px-8 py-5">Role</th>
                            <th className="px-8 py-5">Member Since</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2ede8]">
                        {users.map((p) => (
                            <tr key={p.id} className={cn(
                                "group transition-colors hover:bg-[#f8f7f5]/50",
                                isLoading === p.id && "opacity-50 pointer-events-none"
                            )}>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f27f0d]/10 text-xl font-black text-[#f27f0d]">
                                            {p.full_name?.charAt(0) || p.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black text-[#181411]">{p.full_name || "New Brew"}</p>
                                            <p className="text-xs font-medium text-[#8a7560]">ID: {p.id.slice(0, 8)}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm font-bold text-[#181411]">
                                            <Mail className="h-3 w-3 text-[#f27f0d]" />
                                            {p.email}
                                        </div>
                                        {p.phone && (
                                            <div className="text-xs font-medium text-[#8a7560]">
                                                {p.phone}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={cn(
                                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                                        p.role === "admin" 
                                        ? "bg-[#181411] text-white shadow-lg shadow-[#181411]/10" 
                                        : "bg-[#f8f7f5] text-[#8a7560] border border-[#e6e0db]"
                                    )}>
                                        {p.role === "admin" && <Shield className="h-3 w-3" />}
                                        {p.role}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-sm font-bold text-[#8a7560]">
                                        <Calendar className="h-4 w-4 text-[#e6e0db]" />
                                        {new Date(p.created_at).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right relative">
                                    <div className="flex justify-end">
                                        <Button 
                                            variant="ghost" 
                                            className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setActiveMenu(activeMenu === p.id ? null : p.id)
                                            }}
                                        >
                                            {isLoading === p.id ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <MoreVertical className="h-5 w-5" />
                                            )}
                                        </Button>

                                        {activeMenu === p.id && (
                                            <div 
                                                className="absolute right-8 top-16 z-50 w-56 rounded-2xl bg-white p-2 shadow-2xl border border-[#f2ede8] animate-in slide-in-from-top-2 duration-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#8a7560] text-left">Manage User</div>
                                                <div className="h-px bg-[#f2ede8] my-1" />
                                                
                                                {p.role === "admin" && (
                                                    <button 
                                                        onClick={() => handleRoleUpdate(p.id, "customer")}
                                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#181411] transition-all hover:bg-amber-50 hover:text-amber-600"
                                                    >
                                                        <User className="h-4 w-4" /> Demote to Customer
                                                    </button>
                                                )}
                                                
                                                <div className="h-px bg-[#f2ede8] my-1" />
                                                
                                                <button 
                                                    onClick={() => handleDelete(p.id)}
                                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-red-500 transition-all hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" /> Delete Profile
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className="p-24 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#f8f7f5] text-[#e6e0db]">
                        <Users className="h-12 w-12" />
                    </div>
                    <h3 className="mt-8 text-2xl font-black">No {roleLabel.toLowerCase()} found</h3>
                    <p className="mt-3 text-[#8a7560] font-medium">Try searching or switching tabs.</p>
                </div>
            )}
        </div>
    )

    return (
        <div className="space-y-10" onClick={() => setActiveMenu(null)}>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="rounded-[2.5rem] border border-[#e6e0db] bg-white p-8 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f27f0d]/10 text-[#f27f0d]">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#8a7560]">Total Members</p>
                            <h3 className="text-2xl font-black leading-none">{totalUsers}</h3>
                        </div>
                    </div>
                </div>
                <div className="rounded-[2.5rem] border border-[#e6e0db] bg-white p-8 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#181411]/5 text-[#181411]">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#8a7560]">Admins</p>
                            <h3 className="text-2xl font-black leading-none">{adminCount}</h3>
                        </div>
                    </div>
                </div>
                <div className="rounded-[2.5rem] border border-[#e6e0db] bg-white p-8 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8f7f5] text-[#8a7560]">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#8a7560]">Customers</p>
                            <h3 className="text-2xl font-black leading-none">{customerCount}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Row */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                {/* Search Input */}
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#e6e0db]" />
                    <Input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search members..." 
                        className="h-12 rounded-2xl border-[#e6e0db] pl-12 focus:ring-[#f27f0d] bg-white"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>

                {/* Tab Switcher */}
                <div className="flex h-12 rounded-2xl bg-[#f2ede8] p-1 shadow-inner max-w-fit self-start md:self-auto">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setActiveTab("customers")
                        }}
                        className={cn(
                            "flex items-center gap-2 rounded-xl px-6 text-xs font-black uppercase tracking-widest transition-all",
                            activeTab === "customers" 
                            ? "bg-white text-[#181411] shadow-lg shadow-[#181411]/5" 
                            : "text-[#8a7560] hover:text-[#181411]"
                        )}
                    >
                        <User className="h-4 w-4" />
                        Customers
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setActiveTab("admins")
                        }}
                        className={cn(
                            "flex items-center gap-2 rounded-xl px-6 text-xs font-black uppercase tracking-widest transition-all",
                            activeTab === "admins" 
                            ? "bg-white text-[#181411] shadow-lg shadow-[#181411]/5" 
                            : "text-[#8a7560] hover:text-[#181411]"
                        )}
                    >
                        <Shield className="h-4 w-4" />
                        Admins
                    </button>
                </div>
            </div>

            {/* Tabbed Content */}
            <div className="overflow-hidden rounded-[2.5rem] border border-[#e6e0db] bg-white shadow-sm ring-1 ring-[#181411]/5">
                {activeTab === "customers" ? (
                    <UserTable users={customers} roleLabel="Customers" />
                ) : (
                    <UserTable users={admins} roleLabel="Administrators" />
                )}
            </div>
        </div>
    )
}
