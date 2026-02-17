import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
    title: "Privacy Policy | OUTLAW",
    description: "Privacy Policy for OUTLAW - How we collect, use, and protect your information.",
}

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-red-400 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
                <p className="text-zinc-400 mb-8">Last updated: January 2026</p>

                <div className="prose prose-invert prose-zinc max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            We collect information you provide directly to us, such as when you create an account,
                            make a purchase, or contact us for support. This may include:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
                            <li>Name and email address</li>
                            <li>Phone number</li>
                            <li>Shipping and billing address</li>
                            <li>Payment information (processed securely via our payment partners)</li>
                            <li>Order history and preferences</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
                            <li>Process and fulfill your orders</li>
                            <li>Send order confirmations and shipping updates</li>
                            <li>Respond to your questions and requests</li>
                            <li>Improve our products and services</li>
                            <li>Send promotional communications (with your consent)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            We do not sell your personal information. We may share your information with:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
                            <li>Shipping carriers to deliver your orders</li>
                            <li>Payment processors to complete transactions</li>
                            <li>Service providers who assist in our operations</li>
                            <li>Law enforcement when required by law</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            We implement appropriate security measures to protect your personal information.
                            However, no method of transmission over the internet is 100% secure. We encourage you
                            to use strong passwords and keep your account credentials confidential.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt out of marketing communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Us</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            If you have questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="text-red-400 mt-2">support@outlaw.com</p>
                    </section>
                </div>
            </div>
        </main>
    )
}
