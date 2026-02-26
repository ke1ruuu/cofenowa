"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createOrder(cartItems: any[], totalAmount: number) {
    const supabase = await createClient()
    
    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "You must be logged in to place an order." }
    }

    // 2. Insert order
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            user_id: user.id,
            total_amount: totalAmount,
            status: 'pending',
            payment_status: 'unpaid'
        })
        .select()
        .single()

    if (orderError) {
        console.error("Error creating order:", orderError)
        return { error: "Failed to create order. Please try again." }
    }

    // 3. Insert order items and their addons
    for (const item of cartItems) {
        const { data: orderItem, error: itemError } = await supabase
            .from("order_items")
            .insert([{
                order_id: order.id,
                product_name: item.name,
                variant_name: item.size, // This now contains the full formatted string
                unit_price: item.price,
                quantity: item.quantity,
                subtotal: parseFloat(item.totalPrice)
            }])
            .select()
            .single()

        if (itemError) {
            console.error("Error creating order item:", itemError)
            continue
        }

        // Insert addons for this item if any
        if (item.addons && item.addons.length > 0 && orderItem) {
            const itemAddons = item.addons.map((addon: any) => ({
                order_item_id: orderItem.id,
                addon_name: addon.name,
                addon_price: addon.price
            }))

            const { error: addonsError } = await supabase
                .from("order_item_addons")
                .insert(itemAddons)

            if (addonsError) {
                console.error("Error creating order item addons:", addonsError)
            }
        }
    }

    revalidatePath("/orders")
    revalidatePath("/admin/orders")
    
    return { success: true, orderId: order.id }
}

export async function getCustomerOrders() {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data: orders, error } = await supabase
        .from("orders")
        .select(`
            *,
            order_items (
                *,
                order_item_addons (*)
            )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching orders:", error)
        return { error: error.message }
    }

    return { orders }
}
