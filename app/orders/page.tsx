import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowRight } from "lucide-react"

interface OrderItem {
    id: string
    product_name: string
    product_price: number
    product_image: string | null
    quantity: number
}

interface Order {
    id: string
    order_number: string
    status: string
    total: number
    created_at: string
    order_items: OrderItem[]
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    pending: { icon: <Clock className="w-4 h-4" />, color: "text-yellow-400", label: "Pending" },
    confirmed: { icon: <CheckCircle className="w-4 h-4" />, color: "text-blue-400", label: "Confirmed" },
    processing: { icon: <Package className="w-4 h-4" />, color: "text-purple-400", label: "Processing" },
    shipped: { icon: <Truck className="w-4 h-4" />, color: "text-orange-400", label: "Shipped" },
    delivered: { icon: <CheckCircle className="w-4 h-4" />, color: "text-green-400", label: "Delivered" },
    cancelled: { icon: <XCircle className="w-4 h-4" />, color: "text-red-400", label: "Cancelled" },
}

async function getOrders(): Promise<Order[]> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from("orders")
        .select(`
      id,
      order_number,
      status,
      total,
      created_at,
      order_items (
        id,
        product_name,
        product_price,
        product_image,
        quantity
      )
    `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching orders:", error)
        return []
    }

    return data as Order[]
}

export default async function OrdersPage() {
    const orders = await getOrders()

    if (orders.length === 0) {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
                <div className="text-center p-8">
                    <Package className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">No Orders Yet</h1>
                    <p className="text-zinc-400 mb-6">You haven&apos;t placed any orders yet.</p>
                    <Link
                        href="/catalog"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                    >
                        Start Shopping
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

                <div className="space-y-6">
                    {orders.map((order) => {
                        const status = statusConfig[order.status] || statusConfig.pending
                        const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })

                        return (
                            <div key={order.id} className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                                {/* Order Header */}
                                <div className="px-6 py-4 bg-zinc-800/50 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-sm text-zinc-400">Order</p>
                                            <p className="font-mono font-semibold">{order.order_number}</p>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 ${status.color}`}>
                                            {status.icon}
                                            <span className="text-sm font-medium">{status.label}</span>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-sm text-zinc-400">{orderDate}</p>
                                        <p className="font-semibold text-red-400">₹{order.total.toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="p-6">
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {order.order_items.slice(0, 4).map((item) => (
                                            <div key={item.id} className="relative w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.product_image || "/images/outlaw-tee-skull-graphic.png"}
                                                    alt={item.product_name}
                                                    fill
                                                    className="object-cover"
                                                />
                                                {item.quantity > 1 && (
                                                    <span className="absolute bottom-0 right-0 bg-zinc-900 text-xs px-1.5 py-0.5 rounded-tl">
                                                        ×{item.quantity}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                        {order.order_items.length > 4 && (
                                            <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 text-sm flex-shrink-0">
                                                +{order.order_items.length - 4}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* View Details Link */}
                                <div className="px-6 py-3 border-t border-zinc-800">
                                    <Link
                                        href={`/order-confirmation/${order.id}`}
                                        className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1"
                                    >
                                        View Order Details
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}
