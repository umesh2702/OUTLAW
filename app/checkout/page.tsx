"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Script from "next/script"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, ShoppingBag, Loader2, Shield, CreditCard } from "lucide-react"

declare global {
    interface Window {
        Razorpay: any
    }
}

interface ShippingForm {
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zip: string
    country: string
}

function generateOrderNumber() {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `OL-${timestamp}-${random}`
}

export default function CheckoutPage() {
    const router = useRouter()
    const { cartItems, cartTotal } = useCart()
    const { isLoggedIn, profile, user, loading: authLoading } = useAuth()
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [razorpayLoaded, setRazorpayLoaded] = useState(false)

    const [form, setForm] = useState<ShippingForm>({
        name: profile?.name || "",
        email: profile?.email || "",
        phone: profile?.mobile || "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "India",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (cartItems.length === 0) {
            setError("Your cart is empty")
            return
        }

        if (!razorpayLoaded) {
            setError("Payment system is loading. Please try again in a moment.")
            return
        }

        setIsProcessing(true)
        setError(null)

        try {
            const currentUser = user

            if (!currentUser) {
                setIsProcessing(false)
                router.push("/auth?redirect=/checkout")
                return
            }

            const shippingCost = 0
            const total = cartTotal + shippingCost
            const amountInPaise = Math.round(total * 100)

            // Step 1: Create Razorpay order on server
            const orderRes = await fetch("/api/razorpay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: amountInPaise,
                    currency: "INR",
                    receipt: generateOrderNumber(),
                }),
            })

            if (!orderRes.ok) {
                const errData = await orderRes.json()
                throw new Error(errData.error || "Failed to create payment order")
            }

            const razorpayOrder = await orderRes.json()

            // Step 2: Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "OUTLAW",
                description: `Order for ${cartItems.length} item(s)`,
                order_id: razorpayOrder.id,
                prefill: {
                    name: form.name,
                    email: form.email,
                    contact: form.phone,
                },
                theme: {
                    color: "#ef4444",
                    backdrop_color: "rgba(0, 0, 0, 0.8)",
                },
                handler: function (response: any) {
                    // Store payment data + order info in sessionStorage
                    const orderPayload = {
                        user_id: currentUser.id,
                        order_number: generateOrderNumber(),
                        status: "confirmed",
                        subtotal: cartTotal,
                        shipping_cost: 0,
                        total: total,
                        shipping_name: form.name,
                        shipping_email: form.email,
                        shipping_phone: form.phone,
                        shipping_address: form.address,
                        shipping_city: form.city,
                        shipping_state: form.state,
                        shipping_zip: form.zip,
                        shipping_country: form.country,
                        payment_status: "paid",
                        payment_method: "razorpay",
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                    }

                    const orderItemsPayload = cartItems.map(item => ({
                        product_id: item.productId,
                        product_name: `${item.product?.name || "Unknown Product"} (${item.size})`,
                        product_price: item.product?.price || 0,
                        product_image: item.product?.image_url || null,
                        quantity: item.quantity,
                        subtotal: (item.product?.price || 0) * item.quantity,
                    }))

                    sessionStorage.setItem("outlaw_pending_order", JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderPayload,
                        orderItemsPayload,
                    }))

                    // Immediately navigate to processing page
                    router.push("/order-processing")
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false)
                        setError("Payment was cancelled. You can try again.")
                    },
                    escape: true,
                    confirm_close: true,
                },
            }

            const rzp = new window.Razorpay(options)

            rzp.on("payment.failed", function (response: any) {
                setError(`Payment failed: ${response.error.description}`)
                setIsProcessing(false)
            })

            rzp.open()
        } catch (err: any) {
            console.error("Checkout error:", err)
            setError(err.message || "Failed to initiate payment. Please try again.")
            setIsProcessing(false)
        }
    }

    // Show loading only briefly while auth initializes (not if localStorage already has state)
    if (authLoading && !isLoggedIn) {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-400" />
            </main>
        )
    }

    // Redirect to auth if not logged in (only after auth has finished loading)
    if (!authLoading && !isLoggedIn) {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
                <div className="text-center p-8">
                    <ShoppingBag className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Sign in to Checkout</h1>
                    <p className="text-zinc-400 mb-6">You need to be logged in to place an order.</p>
                    <Link
                        href="/auth?redirect=/checkout"
                        className="inline-block px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </main>
        )
    }


    if (cartItems.length === 0) {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
                <div className="text-center p-8">
                    <ShoppingBag className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
                    <p className="text-zinc-400 mb-6">Add some items before checking out.</p>
                    <Link
                        href="/catalog"
                        className="inline-block px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                    >
                        Browse Catalog
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
                onLoad={() => setRazorpayLoaded(true)}
            />
            <main className="min-h-screen bg-zinc-950 text-zinc-100">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/cart" className="inline-flex items-center gap-2 text-zinc-400 hover:text-red-400 mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Cart
                        </Link>
                        <h1 className="text-3xl font-bold">Checkout</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Shipping Form */}
                        <div>
                            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                                <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-zinc-400 mb-1">Full Name *</label>
                                            <input
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-zinc-400 mb-1">Email *</label>
                                            <input
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-zinc-400 mb-1">Phone *</label>
                                        <input
                                            name="phone"
                                            type="tel"
                                            value={form.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-zinc-400 mb-1">Address *</label>
                                        <input
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm text-zinc-400 mb-1">City *</label>
                                            <input
                                                name="city"
                                                value={form.city}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-zinc-400 mb-1">State</label>
                                            <input
                                                name="state"
                                                value={form.state}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-zinc-400 mb-1">PIN Code *</label>
                                            <input
                                                name="zip"
                                                value={form.zip}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-zinc-400 mb-1">Country</label>
                                        <select
                                            name="country"
                                            value={form.country}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                                        >
                                            <option value="India">India</option>
                                        </select>
                                    </div>

                                    {/* Payment Info */}
                                    <div className="pt-6 border-t border-zinc-800">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-red-400" />
                                            Payment
                                        </h3>
                                        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                                            <div className="flex items-center gap-3">
                                                <Shield className="w-5 h-5 text-green-400" />
                                                <div>
                                                    <p className="font-medium">Secure Payment via Razorpay</p>
                                                    <p className="text-sm text-zinc-400">UPI, Cards, Net Banking, Wallets &amp; more</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            `Pay ₹${cartTotal.toFixed(2)}`
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 sticky top-20">
                                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    {cartItems.map(item => (
                                        <div key={`${item.productId}_${item.size}`} className="flex gap-4">
                                            <div className="relative w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.product.image_url || "/images/outlaw-tee-skull-graphic.png"}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{item.product.name}</p>
                                                <p className="text-sm text-zinc-400">Size: {item.size} • Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-zinc-800 pt-4 space-y-2">
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Shipping</span>
                                        <span className="text-green-400">Free</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold pt-2 border-t border-zinc-800">
                                        <span>Total</span>
                                        <span className="text-red-400">₹{cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
