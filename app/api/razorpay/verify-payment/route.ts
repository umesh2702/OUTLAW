import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { error: "Missing payment verification fields" },
                { status: 400 }
            )
        }

        // Verify signature using HMAC SHA256
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex")

        if (generatedSignature === razorpay_signature) {
            return NextResponse.json({ verified: true })
        } else {
            return NextResponse.json(
                { error: "Payment verification failed. Signature mismatch." },
                { status: 400 }
            )
        }
    } catch (error: any) {
        console.error("Razorpay verify payment error:", error)
        return NextResponse.json(
            { error: error.message || "Payment verification failed" },
            { status: 500 }
        )
    }
}
