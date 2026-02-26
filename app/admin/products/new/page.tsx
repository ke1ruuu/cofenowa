import { createClient } from "@/utils/supabase/server"
import { ProductForm } from "@/components/admin/ProductForm"

export default async function NewProductPage() {
    const supabase = await createClient()
    const { data: categories } = await supabase.from("categories").select("id, name")

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-black tracking-tight">Add New Product</h1>
                <p className="text-[#8a7560] font-medium mt-2">Craft a new addition to the NOWA menu.</p>
            </div>

            <ProductForm categories={categories || []} />
        </div>
    )
}
