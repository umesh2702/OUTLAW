"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { placeOrder } from "@/app/actions/checkout"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

type ProcessingState = "verifying" | "placing" | "success" | "failed"

export default function OrderProcessingPage() {
    const router = useRouter()
    const { clearCart } = useCart()
    const [state, setState] = useState<ProcessingState>("verifying")
    const [errorMsg, setErrorMsg] = useState("")
    const hasStarted = useRef(false)

    useEffect(() => {
        if (hasStarted.current) return
        hasStarted.current = true

        async function processOrder() {
            try {
                // Read payment data from sessionStorage
                const raw = sessionStorage.getItem("outlaw_pending_order")
                if (!raw) {
                    setErrorMsg("No pending order found.")
                    setState("failed")
                    setTimeout(() => router.push("/cart"), 2500)
                    return
                }

                const data = JSON.parse(raw)
                const {
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                    orderPayload,
                    orderItemsPayload,
                } = data

                // Step 1: Verify payment
                setState("verifying")
                const verifyRes = await fetch("/api/razorpay/verify-payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                    }),
                })

                const verifyData = await verifyRes.json()

                if (!verifyRes.ok || !verifyData.verified) {
                    setErrorMsg("Payment verification failed. Please contact support.")
                    setState("failed")
                    sessionStorage.removeItem("outlaw_pending_order")
                    setTimeout(() => router.push("/cart"), 3000)
                    return
                }

                // Step 2: Place order in database
                setState("placing")
                const result = await placeOrder(orderPayload, orderItemsPayload)

                if (result.error) {
                    setErrorMsg(result.error)
                    setState("failed")
                    sessionStorage.removeItem("outlaw_pending_order")
                    setTimeout(() => router.push("/cart"), 3000)
                    return
                }

                // Step 3: Success!
                setState("success")
                sessionStorage.removeItem("outlaw_pending_order")
                clearCart()

                // Navigate to order confirmation
                setTimeout(() => {
                    router.push(`/order-confirmation/${result.orderId}`)
                }, 1000)
            } catch (err) {
                console.error("Order processing error:", err)
                setErrorMsg("Something went wrong. Please contact support.")
                setState("failed")
                sessionStorage.removeItem("outlaw_pending_order")
                setTimeout(() => router.push("/cart"), 3000)
            }
        }

        processOrder()
    }, [router, clearCart])

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
            <div className="text-center p-8 max-w-md">
                {state === "verifying" && (
                    <>
                        <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto mb-6">
                            <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
                        <p className="text-zinc-400">Please wait while we confirm your payment with Razorpay...</p>
                    </>
                )}

                {state === "placing" && (
                    <>
                        <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
                            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Placing Your Order</h1>
                        <p className="text-zinc-400">Payment verified! Creating your order now...</p>
                    </>
                )}

                {state === "success" && (
                    <>
                        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
                        <p className="text-zinc-400">Redirecting to your order details...</p>
                    </>
                )}

                {state === "failed" && (
                    <>
                        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-10 h-10 text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Something Went Wrong</h1>
                        <p className="text-zinc-400 mb-2">{errorMsg}</p>
                        <p className="text-sm text-zinc-500">Redirecting you back...</p>
                    </>
                )}
            </div>
        </main>
    )
}
