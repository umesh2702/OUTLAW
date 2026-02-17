"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function placeOrder(orderPayload: any, orderItems: any[]) {
    const cookieStore = cookies()



    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: any) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
                remove(name: string, options: any) {
                    try {
                        cookieStore.set({ name, value: "", ...options })
                    } catch (error) {
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )

    // Check auth on server side
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        console.error("Server Action: Auth failed", authError)
        return { error: "Authentication failed. Please log in again." }
    }

    // Override user_id in payload to match authenticated user
    orderPayload.user_id = user.id

    // Stock validation: verify all items are in stock before placing order
    const productIds = orderItems.map((item: any) => item.product_id)
    const { data: products, error: stockError } = await supabase
        .from("products")
        .select("id, name, stock_quantity")
        .in("id", productIds)

    if (stockError) {
        return { error: "Failed to verify stock availability. Please try again." }
    }

    const productMap = new Map(products?.map((p: any) => [p.id, p]) || [])
    for (const item of orderItems) {
        const product = productMap.get(item.product_id)
        if (!product) {
            return { error: `Product "${item.product_name}" is no longer available.` }
        }
        if (product.stock_quantity < item.quantity) {
            return {
                error: product.stock_quantity === 0
                    ? `"${product.name}" is out of stock.`
                    : `"${product.name}" only has ${product.stock_quantity} left in stock.`
            }
        }
    }


    // Create order
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderPayload)
        .select()
        .single()

    if (orderError) {
        console.error("Server Action: Order create failed", orderError)
        return { error: `Order placement failed: ${orderError.message}` }
    }



    // Prepare items with correct order_id
    const itemsToInsert = orderItems.map((item: any) => ({
        ...item,
        order_id: order.id
    }))

    // Create order items
    const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert)

    if (itemsError) {
        console.error("Server Action: Items create failed", itemsError)
        // Note: Order exists but items failed. In a real app we might transaction rollback or alert admin.
        return { error: `Partially failed: Order created but items failed. Contact support. ${itemsError.message}` }
    }

    return { success: true, orderId: order.id }
}
