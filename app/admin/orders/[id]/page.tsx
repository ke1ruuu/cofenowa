import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { 
    ArrowLeft, 
    Package, 
    Clock, 
    User, 
    Mail, 
    Phone, 
    CreditCard, 
    MapPin, 
    Calendar,
    ChevronRight,
    Printer,
    Download,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusControl } from "@/components/admin/StatusControl"
import { DeleteOrderButton } from "@/components/admin/DeleteOrderButton"

export default async function OrderDetailsPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    const supabase = await createClient()
    const { id } = await params

    const { data: order } = await supabase
        .from("orders")
        .select(`
            *,
            profiles(full_name, email, phone),
            order_items(
                *,
                order_item_addons(*)
            )
        `)
        .eq("id", id)
        .single()

    if (!order) {
        notFound()
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-24">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
                <Link 
                    href="/admin/orders" 
                    className="group flex items-center gap-2 text-sm font-bold text-[#8a7560] hover:text-[#f27f0d] transition-all"
                >
                    <div className="h-8 w-8 rounded-full border border-[#e6e0db] flex items-center justify-center group-hover:bg-[#f27f0d] group-hover:border-[#f27f0d] group-hover:text-white transition-all">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                    Back to Order List
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full bg-[#f27f0d]/10 text-[#f27f0d] text-[10px] font-black uppercase tracking-widest">
                                Order Dashboard
                            </span>
                            <span className="h-1 w-1 rounded-full bg-[#e6e0db]" />
                            <span className="text-xs font-bold text-[#8a7560]">ID: {order.id}</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight text-[#181411]">
                            #ORD-{order.id.slice(0, 8).toUpperCase()}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-14 px-8 rounded-2xl border-[#e6e0db] font-bold text-[#181411] hover:bg-[#f8f7f5] shadow-sm">
                            <Printer className="h-5 w-5 mr-3 text-[#8a7560]" /> Print
                        </Button>
                        <Button className="h-14 px-8 rounded-2xl bg-[#181411] text-white font-bold shadow-xl hover:scale-[1.02] transition-transform">
                            <Download className="h-5 w-5 mr-3 text-[#f27f0d]" /> Export Invoice
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-[#e6e0db] shadow-sm relative overflow-hidden group">
                    <div className="absolute right-[-10px] top-[-10px] h-24 w-24 bg-[#f27f0d]/5 rounded-full blur-2xl group-hover:bg-[#f27f0d]/10 transition-colors" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] mb-4">Total Amount</p>
                    <p className="text-3xl font-black text-[#181411]">${parseFloat(order.total_amount).toFixed(2)}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-[#e6e0db] shadow-sm relative overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] mb-4">Items Count</p>
                    <p className="text-3xl font-black text-[#181411]">{order.order_items.length} Products</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-[#e6e0db] shadow-sm relative overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] mb-4">Payment</p>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-2xl font-black text-[#181411] uppercase tracking-tighter">{order.payment_status}</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-[#e6e0db] shadow-sm relative overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] mb-4">Time Since Order</p>
                    <p className="text-3xl font-black text-[#181411] flex items-center gap-2">
                        <Clock className="h-6 w-6 text-[#f27f0d]" />
                        {Math.floor((new Date().getTime() - new Date(order.created_at).getTime()) / 60000)}m
                    </p>
                </div>
            </div>

            {/* Fulfillment Command Bar */}
            <StatusControl orderId={order.id} initialStatus={order.status} />

            <div className="space-y-10">
                {/* Main Content Area: Items Section */}
                <section className="bg-white rounded-[3rem] border border-[#e6e0db] shadow-xl overflow-hidden">
                    <div className="px-10 py-10 border-b border-[#f2ede8] flex items-center justify-between bg-[#f8f7f5]/30">
                        <div>
                            <h2 className="text-2xl font-black text-[#181411]">Kitchen Ticket</h2>
                            <p className="text-sm font-medium text-[#8a7560]">Detailed breakdown of customization</p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-[#181411] flex items-center justify-center shadow-lg">
                            <Package className="h-7 w-7 text-[#f27f0d]" />
                        </div>
                    </div>

                    <div className="divide-y divide-[#f2ede8]">
                        {order.order_items?.map((item: any, idx: number) => (
                            <div key={idx} className="p-10 group hover:bg-[#f8f7f5]/50 transition-all">
                                <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                                    <div className="flex gap-8 flex-1">
                                        <div className="relative">
                                            <div className="h-20 w-20 rounded-[2rem] bg-[#181411] flex items-center justify-center font-black text-white text-2xl shadow-xl group-hover:scale-110 transition-transform">
                                                {item.quantity}
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[#f27f0d] border-4 border-white flex items-center justify-center">
                                                <ChevronRight className="h-3 w-3 text-white" />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4 flex-1">
                                            <div>
                                                <h3 className="text-2xl font-black text-[#181411] mb-1">{item.product_name}</h3>
                                                <div className="inline-flex items-center px-3 py-1 bg-[#181411] rounded-lg">
                                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                                        {item.variant_name}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {item.order_item_addons && item.order_item_addons.length > 0 && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                    {item.order_item_addons.map((addon: any, aIdx: number) => (
                                                        <div key={aIdx} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#e6e0db] shadow-sm">
                                                            <div className="h-6 w-6 rounded-lg bg-[#f27f0d]/10 flex items-center justify-center">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-[#f27f0d]" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-black text-[#181411]">{addon.addon_name}</span>
                                                                <span className="text-[10px] font-bold text-[#8a7560]">${addon.addon_price.toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-2 md:pt-2">
                                        <p className="text-3xl font-black text-[#181411] tracking-tighter">
                                            ${item.subtotal.toFixed(2)}
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#8a7560] uppercase tracking-widest">
                                            <span>Unit</span>
                                            <span className="h-1 w-1 rounded-full bg-[#e6e0db]" />
                                            <span>${item.unit_price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Calculation Details */}
                    <div className="p-10 bg-[#f8f7f5]/30 border-t border-[#f2ede8]">
                        <div className="flex flex-col gap-4 ml-auto max-w-sm">
                            <div className="flex justify-between items-center group">
                                <span className="text-sm font-bold text-[#8a7560] uppercase tracking-widest">Order Subtotal</span>
                                <span className="text-lg font-black text-[#181411]">${parseFloat(order.total_amount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center opacity-40">
                                <span className="text-sm font-bold text-[#8a7560] uppercase tracking-widest">Packaging Fee</span>
                                <span className="text-lg font-black text-[#181411]">$0.00</span>
                            </div>
                            <div className="h-px bg-[#e6e0db] my-2" />
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black text-[#181411]">Grand Total</span>
                                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Paid via Digital Wallet</span>
                                </div>
                                <span className="text-5xl font-black text-[#f27f0d] tracking-tighter">
                                    ${parseFloat(order.total_amount).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Metadata Balanced Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Customer Insight Card */}
                    <div className="bg-white rounded-[3rem] border border-[#e6e0db] p-10 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-40 w-40 bg-[#f27f0d]/5 rounded-bl-[10rem] -z-0" />
                        <div className="relative z-10 space-y-10 h-full flex flex-col justify-between">
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f27f0d] mb-8">Customer Profile</h3>
                                <div className="flex items-center gap-6">
                                    <div className="h-16 w-16 rounded-[2rem] bg-[#181411] flex items-center justify-center shadow-xl">
                                        <User className="h-8 w-8 text-[#f27f0d]" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-[#181411]">{order.profiles?.full_name || "Guest User"}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="h-2 w-2 rounded-full bg-[#f27f0d]" />
                                            <span className="text-xs font-bold text-[#8a7560] uppercase tracking-widest">Verified Client</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6 pt-10 border-t border-[#f2ede8]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-5">
                                        <Mail className="h-5 w-5 text-[#8a7560]" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#8a7560]">Email</span>
                                            <span className="text-sm font-bold text-[#181411] truncate">{order.profiles?.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <Phone className="h-5 w-5 text-[#8a7560]" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#8a7560]">Contact</span>
                                            <span className="text-sm font-bold text-[#181411]">{order.profiles?.phone || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5 pt-4 border-t border-[#f2ede8]">
                                    <MapPin className="h-5 w-5 text-[#8a7560] mt-1 shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#8a7560]">Delivery Address</span>
                                        <span className="text-sm font-bold text-[#181411] leading-relaxed">
                                            {order.delivery_address || "In-Store Pickup (Main Branch)"}
                                        </span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Order Timeline Card */}
                    <div className="bg-[#181411] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Clock className="h-24 w-24" />
                        </div>
                        
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f27f0d] mb-10">System Timeline</h3>
                            <div className="space-y-10 relative">
                                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#f27f0d] to-white/10" />
                                
                                <div className="flex gap-6 items-start relative z-10">
                                    <div className="h-10 w-10 rounded-2xl bg-[#f27f0d] flex items-center justify-center shadow-lg shadow-[#f27f0d]/40">
                                        <Calendar className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Creation</p>
                                        <p className="text-sm font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                                        <p className="text-[10px] font-medium text-[#f27f0d] mt-1">{new Date(order.created_at).toLocaleTimeString()}</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-start relative z-10">
                                    <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                        <CheckCircle2 className="h-5 w-5 text-[#f27f0d]" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Server Verification</p>
                                        <p className="text-sm font-bold">Authenticated & Synced</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-10 border-t border-white/10">
                            <DeleteOrderButton orderId={order.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
