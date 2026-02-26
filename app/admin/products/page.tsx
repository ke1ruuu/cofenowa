import { createClient } from "@/utils/supabase/server"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductList } from "../../../components/admin/ProductList"

export default async function AdminProductsPage() {
    const supabase = await createClient()
    
    const { data: products } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false })

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Product Management</h1>
                    <p className="text-[#8a7560] font-medium mt-2">Create, edit, and manage your store products.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="h-14 bg-[#f27f0d] hover:bg-[#f27f0d]/90 rounded-2xl px-8 font-bold text-lg shadow-lg shadow-[#f27f0d]/20 group">
                        <Plus className="mr-2 h-5 w-5" />
                        Add New Product
                    </Button>
                </Link>
            </div>

            <ProductList initialProducts={products || []} />
        </div>
    )
}
