"use client"

import { useState } from "react"
import { 
    Store, 
    Clock, 
    Gift, 
    Bell, 
    Save, 
    Info, 
    Mail, 
    Phone, 
    MapPin, 
    CheckCircle2,
    AlertCircle,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateStoreSetting } from "@/app/admin/actions"
import { cn } from "@/lib/utils"

interface StoreSettingsProps {
    settings: any[]
}

export function SettingsInterface({ settings }: StoreSettingsProps) {
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [activeSection, setActiveSection] = useState("general")
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    // Helper to get specific setting object
    const getSetting = (key: string) => settings.find(s => s.key === key)?.value || {}

    // Section States
    const [storeInfo, setStoreInfo] = useState(getSetting("store_info"))
    const [operationalStatus, setOperationalStatus] = useState(getSetting("operational_status"))
    const [rewardSettings, setRewardSettings] = useState(getSetting("reward_settings"))

    const handleSave = async (key: string, value: any) => {
        setIsLoading(key)
        setSuccessMessage(null)
        try {
            const result = await updateStoreSetting(key, value)
            if (result?.success) {
                setSuccessMessage(`${key.replace('_', ' ')} updated successfully!`)
                setTimeout(() => setSuccessMessage(null), 3000)
            } else if (result?.error) {
                alert(result.error)
            }
        } catch (e) {
            alert("Failed to update setting")
        } finally {
            setIsLoading(null)
        }
    }

    const sections = [
        { id: "general", name: "General Info", icon: Info },
        { id: "operations", name: "Operations", icon: Clock },
        { id: "rewards", name: "Loyalty Program", icon: Gift },
    ]

    return (
        <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-72 space-y-2">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                            "flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest transition-all",
                            activeSection === section.id
                            ? "bg-[#181411] text-white shadow-xl shadow-[#181411]/10"
                            : "text-[#8a7560] hover:bg-[#f2ede8] hover:text-[#181411]"
                        )}
                    >
                        <section.icon className="h-5 w-5" />
                        {section.name}
                    </button>
                ))}
            </aside>

            {/* Content Area */}
            <main className="flex-1 max-w-4xl">
                <div className="rounded-[2.5rem] border border-[#e6e0db] bg-white p-8 md:p-12 shadow-sm">
                    {/* Feedback Toast (Mini) */}
                    {successMessage && (
                        <div className="mb-8 flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-600 animate-in fade-in slide-in-from-top-2">
                            <CheckCircle2 className="h-5 w-5" />
                            {successMessage}
                        </div>
                    )}

                    {/* General Info Section */}
                    {activeSection === "general" && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Store Presentation</h2>
                                <p className="text-[#8a7560] font-medium mt-1">Basic identification and contact details for your cafe.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] ml-1">Store Name</label>
                                    <Input 
                                        value={storeInfo.name}
                                        onChange={(e) => setStoreInfo({...storeInfo, name: e.target.value})}
                                        className="h-12 rounded-2xl border-[#e6e0db] focus:ring-[#f27f0d]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] ml-1">Email Support</label>
                                    <Input 
                                        value={storeInfo.email}
                                        onChange={(e) => setStoreInfo({...storeInfo, email: e.target.value})}
                                        className="h-12 rounded-2xl border-[#e6e0db] focus:ring-[#f27f0d]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] ml-1">Contact Phone</label>
                                    <Input 
                                        value={storeInfo.phone}
                                        onChange={(e) => setStoreInfo({...storeInfo, phone: e.target.value})}
                                        className="h-12 rounded-2xl border-[#e6e0db] focus:ring-[#f27f0d]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] ml-1">Opening Hours</label>
                                    <Input 
                                        value={storeInfo.opening_hours}
                                        onChange={(e) => setStoreInfo({...storeInfo, opening_hours: e.target.value})}
                                        className="h-12 rounded-2xl border-[#e6e0db] focus:ring-[#f27f0d]"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] ml-1">Full Address</label>
                                    <Input 
                                        value={storeInfo.address}
                                        onChange={(e) => setStoreInfo({...storeInfo, address: e.target.value})}
                                        className="h-12 rounded-2xl border-[#e6e0db] focus:ring-[#f27f0d]"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] ml-1">Live Announcement</label>
                                    <Textarea 
                                        value={storeInfo.announcement}
                                        onChange={(e) => setStoreInfo({...storeInfo, announcement: e.target.value})}
                                        className="min-h-[100px] rounded-2xl border-[#e6e0db] focus:ring-[#f27f0d]"
                                        placeholder="Display a message to all customers..."
                                    />
                                </div>
                            </div>

                            <Button 
                                onClick={() => handleSave("store_info", storeInfo)}
                                disabled={isLoading === "store_info"}
                                className="h-14 bg-[#181411] hover:bg-[#181411]/90 text-white rounded-2xl px-10 font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-[#181411]/10"
                            >
                                {isLoading === "store_info" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 mr-3" />}
                                Update Store Identity
                            </Button>
                        </div>
                    )}

                    {/* Operations Section */}
                    {activeSection === "operations" && (
                        <div className="space-y-10 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-[#181411]">Operational Flags</h2>
                                <p className="text-[#8a7560] font-medium mt-1">Control the real-time availability of your store features.</p>
                            </div>

                            <div className="space-y-4">
                                <div 
                                    onClick={() => setOperationalStatus({...operationalStatus, is_open: !operationalStatus.is_open})}
                                    className={cn(
                                        "flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer group",
                                        operationalStatus.is_open 
                                        ? "bg-green-50 border-green-100" 
                                        : "bg-red-50 border-red-100"
                                    )}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                            operationalStatus.is_open ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                        )}>
                                            <Store className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <p className="font-black text-[#181411] text-lg">Store Status</p>
                                            <p className="text-sm font-medium text-[#8a7560]">
                                                {operationalStatus.is_open ? "Currently open for business" : "Store is closed to public"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "h-8 w-14 rounded-full p-1 transition-colors relative",
                                        operationalStatus.is_open ? "bg-green-500" : "bg-zinc-300"
                                    )}>
                                        <div className={cn(
                                            "h-6 w-6 rounded-full bg-white shadow-sm transition-all absolute top-1",
                                            operationalStatus.is_open ? "left-[1.75rem]" : "left-1"
                                        )} />
                                    </div>
                                </div>

                                <div 
                                    onClick={() => setOperationalStatus({...operationalStatus, accepting_orders: !operationalStatus.accepting_orders})}
                                    className={cn(
                                        "flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer group",
                                        operationalStatus.accepting_orders 
                                        ? "bg-amber-50 border-amber-100" 
                                        : "bg-zinc-50 border-zinc-100"
                                    )}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                            operationalStatus.accepting_orders ? "bg-amber-500 text-white" : "bg-zinc-500 text-white"
                                        )}>
                                            <Clock className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <p className="font-black text-[#181411] text-lg">Accepting Orders</p>
                                            <p className="text-sm font-medium text-[#8a7560]">
                                                {operationalStatus.accepting_orders ? "Actively receiving new orders" : "Ordering is temporarily disabled"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "h-8 w-14 rounded-full p-1 transition-colors relative",
                                        operationalStatus.accepting_orders ? "bg-amber-500" : "bg-zinc-300"
                                    )}>
                                        <div className={cn(
                                            "h-6 w-6 rounded-full bg-white shadow-sm transition-all absolute top-1",
                                            operationalStatus.accepting_orders ? "left-[1.75rem]" : "left-1"
                                        )} />
                                    </div>
                                </div>
                            </div>

                            <Button 
                                onClick={() => handleSave("operational_status", operationalStatus)}
                                disabled={isLoading === "operational_status"}
                                className="h-14 bg-[#181411] hover:bg-[#181411]/90 text-white rounded-2xl px-10 font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-[#181411]/10"
                            >
                                {isLoading === "operational_status" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 mr-3" />}
                                Sync Live Status
                            </Button>
                        </div>
                    )}

                    {/* Rewards Section */}
                    {activeSection === "rewards" && (
                        <div className="space-y-10 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-[#181411]">Loyalty Configuration</h2>
                                <p className="text-[#8a7560] font-medium mt-1">Define how customers earn and spend their brew points.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] ml-1">Points/Peso</label>
                                    <Input 
                                        type="number"
                                        value={rewardSettings.points_per_peso}
                                        onChange={(e) => setRewardSettings({...rewardSettings, points_per_peso: parseInt(e.target.value)})}
                                        className="h-14 text-lg font-black rounded-2xl border-[#e6e0db] focus:ring-[#f27f0d]"
                                    />
                                    <p className="text-[10px] text-[#8a7560] px-2">How many points per 1 PHP spent</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] ml-1">Min. Redeem</label>
                                    <Input 
                                        type="number"
                                        value={rewardSettings.min_redeem_points}
                                        onChange={(e) => setRewardSettings({...rewardSettings, min_redeem_points: parseInt(e.target.value)})}
                                        className="h-14 text-lg font-black rounded-2xl border-[#e6e0db] focus:ring-[#f27f0d]"
                                    />
                                    <p className="text-[10px] text-[#8a7560] px-2">Minimum points to start claiming</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] ml-1">Claim Multiplier</label>
                                    <Input 
                                        type="number"
                                        value={rewardSettings.points_per_claim}
                                        onChange={(e) => setRewardSettings({...rewardSettings, points_per_claim: parseInt(e.target.value)})}
                                        className="h-14 text-lg font-black rounded-2xl border-[#e6e0db] focus:ring-[#f27f0d]"
                                    />
                                    <p className="text-[10px] text-[#8a7560] px-2">PHP discount value per claim</p>
                                </div>
                            </div>

                            <div className="rounded-3xl bg-[#f8f7f5] p-8 border border-[#e6e0db] border-dashed">
                                <div className="flex items-start gap-4">
                                    <Gift className="h-6 w-6 text-[#f27f0d] mt-1" />
                                    <div>
                                        <p className="font-black text-[#181411]">Rule Preview</p>
                                        <p className="text-sm font-medium text-[#8a7560] mt-1 leading-relaxed">
                                            A customer spending <span className="text-[#181411] font-bold">100 PHP</span> will earn <span className="text-[#f27f0d] font-bold">{100 * rewardSettings.points_per_peso} points</span>. 
                                            Redeeming points will give them a discount based on your claim multiplier.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button 
                                onClick={() => handleSave("reward_settings", rewardSettings)}
                                disabled={isLoading === "reward_settings"}
                                className="h-14 bg-[#181411] hover:bg-[#181411]/90 text-white rounded-2xl px-10 font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-[#181411]/10"
                            >
                                {isLoading === "reward_settings" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 mr-3" />}
                                Update Rewards Logic
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
