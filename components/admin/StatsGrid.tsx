"use client"

import { useState, useEffect } from "react"
import { 
    Coffee, 
    ShoppingBag, 
    Users, 
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"

interface Stat {
    name: string
    value: string | number
    icon: string 
    change: string
    changeType: "increase" | "decrease" | "neutral"
}

interface StatsGridProps {
    initialStats: Stat[]
}

const iconsMap: Record<string, any> = {
    coffee: Coffee,
    shoppingBag: ShoppingBag,
    users: Users,
    trendingUp: TrendingUp
}

export function StatsGrid({ initialStats }: StatsGridProps) {
    const [stats, setStats] = useState<Stat[]>(initialStats)
    const supabase = createClient()

    useEffect(() => {
        // Subscribe to changes in orders, products, and profiles to keep stats "realtime"
        const ordersChannel = supabase
            .channel('dashboard-stats')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchUpdatedStats())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchUpdatedStats())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchUpdatedStats())
            .subscribe()

        return () => {
            supabase.removeChannel(ordersChannel)
        }
    }, [])

    const fetchUpdatedStats = async () => {
        const { count: productCount } = await supabase.from("products").select("*", { count: 'exact', head: true })
        const { count: orderCount } = await supabase.from("orders").select("*", { count: 'exact', head: true })
        const { count: userCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true }).neq("role", "admin")
        
        const { data: revenueData } = await supabase.from("orders").select("total_amount")
        const totalRevenue = revenueData?.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0) || 0

        setStats(prev => prev.map(stat => {
            if (stat.name === "Total Products") return { ...stat, value: productCount || 0 }
            if (stat.name === "Total Orders") return { ...stat, value: orderCount || 0 }
            if (stat.name === "Total Customers") return { ...stat, value: userCount || 0 }
            if (stat.name === "Revenue") return { ...stat, value: `$${totalRevenue.toFixed(2)}` }
            return stat
        }))
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
                const IconComponent = iconsMap[stat.icon] || Coffee
                return (
                    <div key={stat.name} className="bg-white p-6 rounded-[2rem] border border-[#e6e0db] shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-[#f27f0d]/10 flex items-center justify-center">
                                <IconComponent className="h-6 w-6 text-[#f27f0d]" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-black px-2 py-1 rounded-lg ${
                                stat.changeType === 'increase' ? 'bg-green-50 text-green-600' : 
                                stat.changeType === 'decrease' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
                            }`}>
                                {stat.change}
                                {stat.changeType === 'increase' ? <ArrowUpRight className="h-3 w-3" /> : stat.changeType === 'decrease' ? <ArrowDownRight className="h-3 w-3" /> : null}
                            </div>
                        </div>
                        <p className="text-sm font-bold text-[#8a7560] uppercase tracking-widest">{stat.name}</p>
                        <p className="text-3xl font-black mt-1 leading-none">{stat.value}</p>
                    </div>
                )
            })}
        </div>
    )
}
