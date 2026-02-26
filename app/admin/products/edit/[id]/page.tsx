import { createClient } from "@/utils/supabase/server"
import { ProductForm } from "@/components/admin/ProductForm"
import { notFound } from "next/navigation"

export default async function EditProductPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    const supabase = await createClient()
    const { id } = await params

    const { data: product } = await supabase
        .from("products")
        .select(`
            *,
            product_variants (
                *,
                variant_addons (
                    product_addons (*)
                )
            )
        `)
        .eq("id", id)
        .single()

    const { data: categories } = await supabase.from("categories").select("id, name")

    if (!product) {
        notFound()
    }

    // Flatten the nested data for the form
    const formattedProduct = {
        ...product,
        variants: product.product_variants.map((v: any) => ({
            name: v.name,
            price_modifier: v.price_modifier
        })),
        // Get unique addons across all variants
        addons: Array.from(new Set(
            product.product_variants.flatMap((v: any) => 
                v.variant_addons.map((va: any) => JSON.stringify({
                    name: va.product_addons.name,
                    price: va.product_addons.price
                }))
            )
        )).map((s: any) => JSON.parse(s))
    }

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-black tracking-tight">Edit Product</h1>
                <p className="text-[#8a7560] font-medium mt-2">Refine the details of your menu item.</p>
            </div>

            <ProductForm initialData={formattedProduct} id={id} categories={categories || []} />
        </div>
    )
}
