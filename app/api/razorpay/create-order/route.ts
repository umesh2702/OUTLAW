import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        })

        const body = await request.json()
        const { amount, currency = "INR", receipt } = body

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Invalid amount" },
                { status: 400 }
            )
        }

        const options = {
            amount: Math.round(amount), // amount in paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
        }

        const order = await razorpay.orders.create(options)

        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        })
    } catch (error: any) {
        console.error("Razorpay create order error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to create Razorpay order" },
            { status: 500 }
        )
    }
}
