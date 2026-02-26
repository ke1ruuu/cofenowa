"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function checkAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

    return profile?.role === "admin"
}

export async function createProduct(formData: FormData) {
    if (!await checkAdmin()) throw new Error("Unauthorized")

    const supabase = await createClient()
    
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const basePrice = parseFloat(formData.get("base_price") as string)
    const imageUrl = formData.get("image_url") as string
    const categoryId = formData.get("category_id") as string
    const isAvailable = formData.get("is_available") === "on"
    
    const variants = JSON.parse(formData.get("variants_json") as string || "[]")
    const addons = JSON.parse(formData.get("addons_json") as string || "[]")

    // 1. Insert Product
    const { data: product, error: productError } = await supabase
        .from("products")
        .insert([{
            name,
            description,
            base_price: basePrice,
            image_url: imageUrl,
            category_id: categoryId,
            is_available: isAvailable
        }])
        .select()
        .single()

    if (productError) {
        console.error("Error creating product:", productError)
        return { error: productError.message }
    }

    // 2. Insert Variants
    if (variants.length > 0) {
        const { data: createdVariants, error: variantsError } = await supabase
            .from("product_variants")
            .insert(variants.map((v: any) => ({
                product_id: product.id,
                name: v.name,
                price_modifier: v.price_modifier
            })))
            .select()

        if (variantsError) {
            console.error("Error creating variants:", variantsError)
            // Rollback product? (Supabase doesn't easily support cross-call transactions here)
        } else if (addons.length > 0 && createdVariants) {
            // 3. Handle Addons and Links
            for (const addon of addons) {
                // Check if addon exists or create it
                let addonId;
                const { data: existingAddon } = await supabase
                    .from("product_addons")
                    .select("id")
                    .eq("name", addon.name)
                    .single()

                if (existingAddon) {
                    addonId = existingAddon.id
                } else {
                    const { data: newAddon } = await supabase
                        .from("product_addons")
                        .insert([{ name: addon.name, price: addon.price }])
                        .select()
                        .single()
                    addonId = newAddon?.id
                }

                if (addonId) {
                    // Link to all variants
                    const links = createdVariants.map(v => ({
                        variant_id: v.id,
                        addon_id: addonId
                    }))
                    await supabase.from("variant_addons").insert(links)
                }
            }
        }
    }

    revalidatePath("/admin/products")
    revalidatePath("/menu")
    redirect("/admin/products")
}

export async function updateProduct(id: string, formData: FormData) {
    if (!await checkAdmin()) throw new Error("Unauthorized")

    const supabase = await createClient()
    
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const basePrice = parseFloat(formData.get("base_price") as string)
    const imageUrl = formData.get("image_url") as string
    const categoryId = formData.get("category_id") as string
    const isAvailable = formData.get("is_available") === "on"
    
    const variants = JSON.parse(formData.get("variants_json") as string || "[]")
    const addons = JSON.parse(formData.get("addons_json") as string || "[]")

    // 1. Update product
    const { error: productError } = await supabase
        .from("products")
        .update({
            name,
            description,
            base_price: basePrice,
            image_url: imageUrl,
            category_id: categoryId,
            is_available: isAvailable
        })
        .eq("id", id)

    if (productError) {
        console.error("Error updating product:", productError)
        return { error: productError.message }
    }

    // 2. Sync Variants (Delete all and re-insert for simplicity)
    await supabase.from("product_variants").delete().eq("product_id", id)

    if (variants.length > 0) {
        const { data: createdVariants, error: variantsError } = await supabase
            .from("product_variants")
            .insert(variants.map((v: any) => ({
                product_id: id,
                name: v.name,
                price_modifier: v.price_modifier
            })))
            .select()

        if (!variantsError && addons.length > 0 && createdVariants) {
            // 3. Handle Addons and Links
            for (const addon of addons) {
                let addonId;
                const { data: existingAddon } = await supabase
                    .from("product_addons")
                    .select("id")
                    .eq("name", addon.name)
                    .single()

                if (existingAddon) {
                    addonId = existingAddon.id
                } else {
                    const { data: newAddon } = await supabase
                        .from("product_addons")
                        .insert([{ name: addon.name, price: addon.price }])
                        .select()
                        .single()
                    addonId = newAddon?.id
                }

                if (addonId) {
                    const links = createdVariants.map(v => ({
                        variant_id: v.id,
                        addon_id: addonId
                    }))
                    await supabase.from("variant_addons").insert(links)
                }
            }
        }
    }

    revalidatePath("/admin/products")
    revalidatePath(`/admin/products/${id}`)
    revalidatePath("/menu")
    redirect("/admin/products")
}

export async function deleteProduct(id: string) {
    if (!await checkAdmin()) throw new Error("Unauthorized")

    const supabase = await createClient()
    
    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)

    if (error) {
        console.error("Error deleting product:", error)
        return { error: error.message }
    }

    revalidatePath("/admin/products")
    revalidatePath("/menu")
    return { success: true }
}

export async function updateOrderStatus(id: string, status: string) {
    if (!await checkAdmin()) throw new Error("Unauthorized")

    const supabase = await createClient()
    
    const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)

    if (error) {
        console.error("Error updating order status:", error)
        return { error: error.message }
    }

    revalidatePath("/admin/orders")
    return { success: true }
}

export async function deleteFeedback(id: string) {
    if (!await checkAdmin()) throw new Error("Unauthorized")

    const supabase = await createClient()
    
    const { error } = await supabase
        .from("feedbacks")
        .delete()
        .eq("id", id)

    if (error) {
        console.error("Error deleting feedback:", error)
        return { error: error.message }
    }

    revalidatePath("/admin/feedbacks")
    return { success: true }
}

export async function updateFeedbackStatus(id: string, status: string) {
    if (!await checkAdmin()) throw new Error("Unauthorized")

    const supabase = await createClient()
    
    const { error } = await supabase
        .from("feedbacks")
        .update({ status })
        .eq("id", id)

    if (error) {
        console.error("Error updating feedback status:", error)
        return { error: error.message }
    }

    revalidatePath("/admin/feedbacks")
    return { success: true }
}
export async function deleteOrder(id: string) {
    if (!await checkAdmin()) throw new Error("Unauthorized")

    const supabase = await createClient()
    
    const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", id)

    if (error) {
        console.error("Error deleting order:", error)
        return { error: error.message }
    }

    revalidatePath("/admin/orders")
    return { success: true }
}

export async function updateUserRole(userId: string, role: string) {
    if (!await checkAdmin()) throw new Error("Unauthorized")

    const supabase = await createClient()
    
    const { error } = await supabase
        .from("profiles")
        .update({ role: role.toLowerCase() })
        .eq("id", userId)

    if (error) {
        console.error("Error updating user role:", error)
        return { error: error.message }
    }

    revalidatePath("/admin/users")
    return { success: true }
}

export async function deleteUser(userId: string) {
    if (!await checkAdmin()) throw new Error("Unauthorized")

    const supabase = await createClient()
    
    // Note: This only deletes the profile. Deleting the Auth user requires the admin API on the server.
    // For now, we delete the profile which is enough for the store context.
    const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId)

    if (error) {
        console.error("Error deleting profile:", error)
        return { error: error.message }
    }

    revalidatePath("/admin/users")
    return { success: true }
}

export async function updateStoreSetting(key: string, value: any) {
    if (!await checkAdmin()) throw new Error("Unauthorized")

    const supabase = await createClient()
    
    const { error } = await supabase
        .from("store_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key)

    if (error) {
        console.error("Error updating store setting:", error)
        return { error: error.message }
    }

    revalidatePath("/admin/settings")
    revalidatePath("/")
    revalidatePath("/home")
    revalidatePath("/menu")
    return { success: true }
}
