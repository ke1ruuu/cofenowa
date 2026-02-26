import { createClient } from "@/utils/supabase/server"
import { 
    Coffee, 
    ShoppingBag, 
    Users, 
    TrendingUp,
    Clock
} from "lucide-react"
import { StatsGrid } from "@/components/admin/StatsGrid"

export default async function AdminDashboardOverview() {
    const supabase = await createClient()

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString()
    const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000)).toISOString()

    const { count: totalProducts } = await supabase.from("products").select("*", { count: 'exact', head: true })
    const { count: prevProducts } = await supabase.from("products").select("*", { count: 'exact', head: true }).lt("created_at", thirtyDaysAgo)
    const productChange = prevProducts ? Math.round(((totalProducts! - prevProducts) / prevProducts) * 100) : totalProducts! * 100

    const { count: totalOrders } = await supabase.from("orders").select("*", { count: 'exact', head: true })
    const { count: recentOrdersCount } = await supabase.from("orders").select("*", { count: 'exact', head: true }).gt("created_at", thirtyDaysAgo)
    const { count: prevOrdersCount } = await supabase.from("orders").select("*", { count: 'exact', head: true }).gt("created_at", sixtyDaysAgo).lt("created_at", thirtyDaysAgo)
    const orderChange = prevOrdersCount ? Math.round(((recentOrdersCount! - prevOrdersCount) / prevOrdersCount) * 100) : recentOrdersCount! * 100

    const { count: totalCustomers } = await supabase.from("profiles").select("*", { count: 'exact', head: true }).neq("role", "admin")
    const { count: recentCustomers } = await supabase.from("profiles").select("*", { count: 'exact', head: true }).neq("role", "admin").gt("created_at", thirtyDaysAgo)
    const { count: prevCustomers } = await supabase.from("profiles").select("*", { count: 'exact', head: true }).neq("role", "admin").gt("created_at", sixtyDaysAgo).lt("created_at", thirtyDaysAgo)
    const customerChange = prevCustomers ? Math.round(((recentCustomers! - prevCustomers) / prevCustomers) * 100) : recentCustomers! * 100

    const { data: revenueData } = await supabase.from("orders").select("total_amount, created_at")
    
    const totalRevenue = revenueData?.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0) || 0
    const recentRevenue = revenueData?.filter(o => o.created_at > thirtyDaysAgo).reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0) || 0
    const prevRevenue = revenueData?.filter(o => o.created_at > sixtyDaysAgo && o.created_at <= thirtyDaysAgo).reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0) || 0
    const revenueChange = prevRevenue ? Math.round(((recentRevenue - prevRevenue) / prevRevenue) * 100) : (recentRevenue > 0 ? 100 : 0)

    const stats = [
        { 
            name: "Total Products", 
            value: totalProducts || 0, 
            icon: "coffee", 
            change: `${productChange >= 0 ? '+' : ''}${productChange}%`, 
            changeType: productChange >= 0 ? "increase" : "decrease" 
        },
        { 
            name: "Total Orders", 
            value: totalOrders || 0, 
            icon: "shoppingBag", 
            change: `${orderChange >= 0 ? '+' : ''}${orderChange}%`, 
            changeType: orderChange >= 0 ? "increase" : "decrease" 
        },
        { 
            name: "Total Customers", 
            value: totalCustomers || 0, 
            icon: "users", 
            change: `${customerChange >= 0 ? '+' : ''}${customerChange}%`, 
            changeType: customerChange >= 0 ? "increase" : "decrease" 
        },
        { 
            name: "Revenue", 
            value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
            icon: "trendingUp", 
            change: `${revenueChange >= 0 ? '+' : ''}${revenueChange}%`, 
            changeType: revenueChange >= 0 ? "increase" : "decrease"
        }
    ]

    const { data: recentOrders } = await supabase
        .from("orders")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false })
        .limit(5)

    const typedStats = stats.map(s => ({
        ...s,
        changeType: s.changeType as "increase" | "decrease" | "neutral"
    }))

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-black tracking-tight">Dashboard Overview</h1>
                <p className="text-[#8a7560] font-medium mt-2">Welcome to your admin control panel.</p>
            </div>

            <StatsGrid initialStats={typedStats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] border border-[#e6e0db] overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-[#f2ede8] flex items-center justify-between">
                        <h2 className="text-xl font-black flex items-center gap-3">
                            <Clock className="h-5 w-5 text-[#f27f0d]" />
                            Recent Orders
                        </h2>
                        <button className="text-xs font-black uppercase tracking-widest text-[#f27f0d] hover:underline">
                            View All
                        </button>
                    </div>
                    <div className="p-0">
                        {recentOrders && recentOrders.length > 0 ? (
                            <div className="divide-y divide-[#f2ede8]">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="p-6 flex items-center justify-between hover:bg-[#f8f7f5] transition-colors">
                                        <div>
                                            <p className="font-bold text-sm">#ORD-{order.id.slice(0, 4)}</p>
                                            <p className="text-xs text-[#8a7560] font-medium">{order.profiles?.full_name || 'Guest'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-sm">${order.total_amount ? parseFloat(order.total_amount.toString()).toFixed(2) : "0.00"}</p>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#f27f0d] bg-[#f27f0d]/10 px-2 py-0.5 rounded">
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-[#8a7560]">
                                <p className="font-medium italic">No orders yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[#181411] p-8 rounded-[2.5rem] text-white overflow-hidden relative">
                         <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-[#f27f0d]/20 rounded-full blur-2xl" />
                         <h3 className="text-xl font-black mb-4">Admin Tip</h3>
                         <p className="text-white/60 text-sm leading-relaxed mb-6 font-medium">
                            Keep your product availability up to date to ensure customers don't order out-of-stock items. You can toggle visibility quickly in the products section.
                         </p>
                         <button className="bg-[#f27f0d] px-6 py-2.5 rounded-xl text-sm font-black hover:bg-[#f27f0d]/90 transition-all">
                            Manage Inventory
                         </button>
                    </div>
                    
                    <div className="bg-[#f27f0d]/5 p-8 rounded-[2.5rem] border border-[#f27f0d]/10">
                        <h3 className="text-xl font-black mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="bg-white p-4 rounded-2xl border border-[#e6e0db] text-left hover:border-[#f27f0d] transition-all group">
                                <p className="font-bold group-hover:text-[#f27f0d]">Add Product</p>
                                <p className="text-[10px] text-[#8a7560] font-medium">Create a new item</p>
                            </button>
                            <button className="bg-white p-4 rounded-2xl border border-[#e6e0db] text-left hover:border-[#f27f0d] transition-all group">
                                <p className="font-bold group-hover:text-[#f27f0d]">View Sales</p>
                                <p className="text-[10px] text-[#8a7560] font-medium">Check reports</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
