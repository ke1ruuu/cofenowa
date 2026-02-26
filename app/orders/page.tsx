import { createClient } from "@/utils/supabase/server"
import { getCustomerOrders } from "./actions"
import Header from "@/components/home/Header"
import Footer from "@/components/home/Footer"
import { ShoppingBag, Clock, ChevronRight, Package, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function OrdersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { orders, error } = await getCustomerOrders()

    return (
        <div className="min-h-screen bg-[#f8f7f5] flex flex-col">
            <Header />
            
            <main className="flex-1 container mx-auto max-w-5xl px-4 py-12 md:py-20">
                <div className="mb-12">
                    <h1 className="text-4xl font-black tracking-tight text-[#181411]">Order History</h1>
                    <p className="text-[#8a7560] font-medium mt-2">Track and manage your recent coffee runs.</p>
                </div>

                {error ? (
                    <div className="bg-red-50 border border-red-100 rounded-[2rem] p-8 text-center">
                        <p className="text-red-500 font-bold">{error}</p>
                    </div>
                ) : orders && orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order: any) => (
                            <div 
                                key={order.id} 
                                className="bg-white rounded-[2.5rem] border border-[#e6e0db] overflow-hidden shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-[#f2ede8]">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-[#f27f0d]/10 flex items-center justify-center">
                                                <Package className="h-7 w-7 text-[#f27f0d]" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-widest text-[#8a7560]">Order ID</p>
                                                <p className="text-lg font-black text-[#181411]">#ORD-{order.id.slice(0, 8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="px-4 py-2 rounded-xl bg-[#f8f7f5] border border-[#e6e0db] flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-[#8a7560]" />
                                                <span className="text-xs font-bold text-[#8a7560]">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', { 
                                                        month: 'short', 
                                                        day: 'numeric', 
                                                        year: 'numeric' 
                                                    })}
                                                </span>
                                            </div>
                                            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
                                                order.status === 'completed' 
                                                    ? 'bg-green-50 border-green-100 text-green-600' 
                                                    : 'bg-[#f27f0d]/5 border-[#f27f0d]/10 text-[#f27f0d]'
                                            }`}>
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span className="text-xs font-black uppercase tracking-widest">{order.status}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#8a7560]">Items Ordered</p>
                                            <div className="space-y-3">
                                                {order.order_items?.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-2 w-2 rounded-full bg-[#f27f0d]" />
                                                            <div>
                                                                <p className="text-sm font-bold text-[#181411]">
                                                                    {item.quantity}x {item.product_name}
                                                                </p>
                                                                <p className="text-[10px] font-medium text-[#8a7560] uppercase tracking-wider">
                                                                    {item.variant_name}
                                                                </p>
                                                                {item.order_item_addons && item.order_item_addons.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {item.order_item_addons.map((addon: any, aIdx: number) => (
                                                                            <span key={aIdx} className="text-[9px] bg-[#f8f7f5] text-[#8a7560] px-1.5 py-0.5 rounded border border-[#e6e0db] font-bold">
                                                                                + {addon.addon_name}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm font-black text-[#8a7560]">${item.subtotal.toFixed(2)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-[#f8f7f5] rounded-3xl p-6 flex flex-col justify-between">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold text-[#8a7560]">Total Amount</p>
                                                <p className="text-2xl font-black text-[#181411]">${order.total_amount.toFixed(2)}</p>
                                            </div>
                                            <div className="mt-6 flex items-center justify-between pt-6 border-t border-[#e6e0db]">
                                                <p className="text-xs font-bold text-[#8a7560]">Payment Status</p>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#f27f0d]">
                                                    {order.payment_status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] border border-[#e6e0db] p-20 text-center shadow-sm">
                        <div className="mx-auto h-24 w-24 rounded-full bg-[#f8f7f5] flex items-center justify-center mb-8 border border-[#e6e0db]">
                            <ShoppingBag className="h-10 w-10 text-[#e6e0db]" />
                        </div>
                        <h3 className="text-2xl font-black mb-2 text-[#181411]">No orders yet</h3>
                        <p className="text-[#8a7560] font-medium mb-10 max-w-md mx-auto">
                            Your caffeine journey hasn't started yet! Head over to our menu and grab your first cup.
                        </p>
                        <Link href="/menu">
                            <button className="h-14 bg-[#f27f0d] text-white px-10 rounded-2xl font-black text-lg shadow-lg shadow-[#f27f0d]/20 hover:scale-105 transition-transform active:scale-95">
                                Browse Menu
                            </button>
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
