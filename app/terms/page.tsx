import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
    title: "Terms of Service | OUTLAW",
    description: "Terms of Service for OUTLAW - Rules and conditions for using our website and services.",
}

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-red-400 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
                <p className="text-zinc-400 mb-8">Last updated: January 2026</p>

                <div className="prose prose-invert prose-zinc max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            By accessing and using the OUTLAW website, you accept and agree to be bound by these
                            Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Use of Service</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            You agree to use our service only for lawful purposes. You must not:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
                            <li>Use the service for any illegal or unauthorized purpose</li>
                            <li>Attempt to interfere with the proper functioning of the website</li>
                            <li>Create multiple accounts for fraudulent purposes</li>
                            <li>Resell our products without authorization</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Account Registration</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            To place orders, you may need to create an account. You are responsible for:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
                            <li>Providing accurate and complete information</li>
                            <li>Maintaining the security of your account credentials</li>
                            <li>All activities that occur under your account</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Products and Orders</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            All product descriptions, images, and prices are subject to change without notice.
                            We reserve the right to limit quantities and refuse any order. Product colors may
                            appear slightly different on different screens.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Pricing and Payment</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            All prices are displayed in INR (₹). We accept payments via Razorpay including UPI, cards,
                            net banking, and wallets. Payment must be received before order processing begins.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Shipping</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            Shipping times are estimates and not guaranteed. OUTLAW is not responsible for delays
                            caused by carriers, customs, or other factors beyond our control. Risk of loss transfers
                            to you upon delivery to the carrier.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Intellectual Property</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            All content on this website, including logos, images, text, and designs, is the property
                            of OUTLAW and protected by intellectual property laws. You may not use our content
                            without written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            OUTLAW shall not be liable for any indirect, incidental, special, or consequential
                            damages arising from your use of our service or products.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to Terms</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            We reserve the right to modify these terms at any time. Changes will be effective
                            immediately upon posting. Your continued use of the service constitutes acceptance
                            of the modified terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">10. Contact</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            For questions about these Terms of Service, contact us at:
                        </p>
                        <p className="text-red-400 mt-2">legal@outlaw.com</p>
                    </section>
                </div>
            </div>
        </main>
    )
}
