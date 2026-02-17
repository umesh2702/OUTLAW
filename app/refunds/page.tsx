import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
    title: "Refund Policy | OUTLAW",
    description: "Refund and Return Policy for OUTLAW - Learn about our return process and refund conditions.",
}

export default function RefundPolicyPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-red-400 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <h1 className="text-4xl font-bold mb-2">Refund & Return Policy</h1>
                <p className="text-zinc-400 mb-8">Last updated: January 2026</p>

                <div className="prose prose-invert prose-zinc max-w-none space-y-8">
                    <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-3">Quick Summary</h2>
                        <ul className="text-zinc-300 space-y-2">
                            <li>✓ <strong>30-day return window</strong> from delivery date</li>
                            <li>✓ <strong>Free returns</strong> on all orders</li>
                            <li>✓ <strong>Full refund</strong> for unworn items with tags</li>
                            <li>✓ <strong>Exchange available</strong> for different sizes</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Return Eligibility</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            To be eligible for a return, your item must be:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
                            <li>Unworn and unwashed</li>
                            <li>In original condition with all tags attached</li>
                            <li>In original packaging</li>
                            <li>Returned within 30 days of delivery</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Non-Returnable Items</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            The following items cannot be returned:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
                            <li>Items marked as &quot;Final Sale&quot;</li>
                            <li>Customized or personalized items</li>
                            <li>Items that show signs of wear or washing</li>
                            <li>Items without original tags</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. How to Return</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            To initiate a return:
                        </p>
                        <ol className="list-decimal list-inside text-zinc-300 mt-3 space-y-2">
                            <li>Email us at <span className="text-red-400">returns@outlaw.com</span> with your order number</li>
                            <li>We&apos;ll send you a prepaid return shipping label</li>
                            <li>Pack the item(s) securely in original packaging</li>
                            <li>Drop off the package at the nearest courier location</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Refund Process</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            Once we receive and inspect your return:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
                            <li>We&apos;ll notify you via email about the approval status</li>
                            <li>Approved refunds are processed within 5-7 business days</li>
                            <li>Refunds are credited to the original payment method</li>
                            <li>You&apos;ll receive an email confirmation when the refund is issued</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Exchanges</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            Need a different size? We offer free exchanges:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
                            <li>Contact us with your order number and desired size</li>
                            <li>We&apos;ll check availability and arrange the exchange</li>
                            <li>Ship back the original item using our prepaid label</li>
                            <li>We&apos;ll ship the new size once we receive your return</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Damaged or Defective Items</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            If you receive a damaged or defective item:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
                            <li>Contact us immediately with photos of the issue</li>
                            <li>We&apos;ll arrange a free replacement or full refund</li>
                            <li>No need to return the damaged item in most cases</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            For any questions about returns or refunds, reach out to us:
                        </p>
                        <p className="text-red-400 mt-2">returns@outlaw.com</p>
                    </section>
                </div>
            </div>
        </main>
    )
}
