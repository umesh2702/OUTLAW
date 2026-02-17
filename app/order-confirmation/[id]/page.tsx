import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle, Package, ArrowRight } from "lucide-react"

interface OrderItem {
    id: string
    product_name: string
    product_price: number
    product_image: string | null
    quantity: number
    subtotal: number
}

interface Order {
    id: string
    order_number: string
    status: string
    subtotal: number
    shipping_cost: number
    total: number
    shipping_name: string
    shipping_email: string
    shipping_phone: string | null
    shipping_address: string
    shipping_city: string
    shipping_state: string | null
    shipping_zip: string
    shipping_country: string
    payment_status: string
    payment_method: string | null
    razorpay_payment_id: string | null
    created_at: string
    order_items: OrderItem[]
}

async function getOrder(id: string): Promise<Order | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("orders")
        .select(`
      *,
      order_items (*)
    `)
        .eq("id", id)
        .single()

    if (error || !data) {
        console.error("Error fetching order:", error)
        return null
    }

    return data as Order
}

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const order = await getOrder(id)

    if (!order) {
        notFound()
    }

    const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 py-12">
            <div className="max-w-3xl mx-auto px-4">
                {/* Success Header */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
                    <p className="text-zinc-400">
                        Thank you for your order. We&apos;ll send you a confirmation email shortly.
                    </p>
                </div>

                {/* Order Info Card */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden mb-6">
                    <div className="px-6 py-4 bg-zinc-800/50 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <p className="text-sm text-zinc-400">Order Number</p>
                            <p className="font-mono font-semibold text-lg">{order.order_number}</p>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-sm text-zinc-400">Order Date</p>
                            <p className="font-medium">{orderDate}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                        <h3 className="font-semibold mb-4">Items Ordered</h3>
                        <div className="space-y-4">
                            {order.order_items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.product_image || "/images/outlaw-tee-skull-graphic.png"}
                                            alt={item.product_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium">{item.product_name}</p>
                                        <p className="text-sm text-zinc-400">Qty: {item.quantity} × ₹{item.product_price}</p>
                                    </div>
                                    <p className="font-medium">₹{item.subtotal.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="px-6 py-4 bg-zinc-800/30 border-t border-zinc-800">
                        <div className="flex justify-between text-sm text-zinc-400 mb-1">
                            <span>Subtotal</span>
                            <span>₹{order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-zinc-400 mb-2">
                            <span>Shipping</span>
                            <span className="text-green-400">Free</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-zinc-700">
                            <span>Total</span>
                            <span className="text-red-400">₹{order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Info */}
                {order.payment_method && (
                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            Payment Details
                        </h3>
                        <div className="text-zinc-300 space-y-1">
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Method</span>
                                <span className="capitalize">{order.payment_method}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Status</span>
                                <span className="text-green-400 capitalize">{order.payment_status}</span>
                            </div>
                            {order.razorpay_payment_id && (
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Payment ID</span>
                                    <span className="font-mono text-sm">{order.razorpay_payment_id}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Shipping Address */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-red-400" />
                        Shipping Address
                    </h3>
                    <div className="text-zinc-300">
                        <p className="font-medium">{order.shipping_name}</p>
                        <p>{order.shipping_address}</p>
                        <p>{order.shipping_city}{order.shipping_state ? `, ${order.shipping_state}` : ""} {order.shipping_zip}</p>
                        <p>{order.shipping_country}</p>
                        {order.shipping_phone && <p className="mt-2 text-zinc-400">{order.shipping_phone}</p>}
                        <p className="text-zinc-400">{order.shipping_email}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/orders"
                        className="flex-1 py-3 px-6 rounded-lg bg-zinc-800 text-center font-medium hover:bg-zinc-700 transition-colors"
                    >
                        View All Orders
                    </Link>
                    <Link
                        href="/catalog"
                        className="flex-1 py-3 px-6 rounded-lg bg-red-500 text-center font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                        Continue Shopping
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </main>
    )
}
