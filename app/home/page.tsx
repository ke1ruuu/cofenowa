import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Header from "@/components/home/Header"
import Footer from "@/components/home/Footer"
import { Tag, ChevronRight } from "lucide-react"
import { DashboardHero } from "@/components/dashboard/DashboardHero"
import { RecommendedGrid } from "@/components/dashboard/RecommendedGrid"
import { RecentOrders } from "@/components/dashboard/RecentOrders"
import { CategoryShortcuts } from "@/components/dashboard/CategoryShortcuts"

export default async function AuthenticatedHomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("is_available", true)
    .limit(3)

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  const recommendedProducts = products?.map(p => ({
    id: p.id,
    name: p.name,
    price: p.base_price,
    image: p.image_url || "/images/coffee1.jpg",
    category: p.categories?.name || "Coffee"
  })) || []

  const recentOrders = orders?.map(o => ({
    id: `ORD-${o.id.slice(0, 4).toUpperCase()}`,
    date: new Date(o.created_at).toLocaleDateString(),
    status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
    total: `$${o.total_amount.toFixed(2)}`,
    items: "Order Details" // Since we don't fetch order items count here for simplicity
  })) || []

  const userName = profile?.full_name || user.email?.split('@')[0] || "Member"

  return (
    <div className="min-h-screen bg-[#f8f7f5] text-[#181411]">
      <Header />
      
      <main className="container mx-auto max-w-7xl px-4 py-12 md:px-10">
        <DashboardHero userName={userName} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
                <RecommendedGrid products={recommendedProducts} />
                <CategoryShortcuts />
            </div>

            <div className="space-y-8">
                {recentOrders.length > 0 && <RecentOrders orders={recentOrders} />}

                <section className="rounded-[2.5rem] bg-[#181411] p-8 text-white relative overflow-hidden">
                    <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-[#f27f0d]/20 rounded-full blur-2xl" />
                    <div className="relative z-10">
                        <Tag className="h-8 w-8 text-[#f27f0d] mb-4" />
                        <h3 className="text-xl font-black mb-2">Weekend Special</h3>
                        <p className="text-sm text-white/60 mb-6 font-medium">Buy any Large coffee and get a Butter Croissant for free!</p>
                        <div className="flex items-center gap-2 text-[#f27f0d] font-black text-xs uppercase tracking-widest cursor-pointer hover:gap-3 transition-all">
                            Claim Reward <ChevronRight className="h-4 w-4" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
