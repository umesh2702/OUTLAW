"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Mail, Phone, MapPin, MessageSquare, Loader2, Check } from "lucide-react"

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsSubmitting(false)
        setSubmitted(true)
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-red-400 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="mb-12 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                        Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 sm:p-8">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                                        <Check className="w-8 h-8 text-green-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                    <p className="text-zinc-400 mb-6">
                                        Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSubmitted(false)
                                            setForm({ name: "", email: "", subject: "", message: "" })
                                        }}
                                        className="px-6 py-2.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <MessageSquare className="w-5 h-5 text-red-400" />
                                        <h2 className="text-xl font-semibold">Send us a message</h2>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-zinc-400 mb-1.5">Name *</label>
                                                <input
                                                    type="text"
                                                    value={form.name}
                                                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                                    required
                                                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
                                                    placeholder="Your name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-zinc-400 mb-1.5">Email *</label>
                                                <input
                                                    type="email"
                                                    value={form.email}
                                                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                                                    required
                                                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-zinc-400 mb-1.5">Subject *</label>
                                            <input
                                                type="text"
                                                value={form.subject}
                                                onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                                                required
                                                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
                                                placeholder="What's this about?"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-zinc-400 mb-1.5">Message *</label>
                                            <textarea
                                                value={form.message}
                                                onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                                                required
                                                rows={5}
                                                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors resize-none"
                                                placeholder="Tell us what's on your mind..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Email us at</p>
                                    <p className="font-medium text-red-400">support@outlaw.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Call us at</p>
                                    <p className="font-medium">+91 98765 43210</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Our office</p>
                                    <p className="font-medium text-sm">Bangalore, Karnataka, India</p>
                                </div>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                            <h3 className="font-semibold mb-4">Common Questions</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-zinc-200">How long does shipping take?</p>
                                    <p className="text-xs text-zinc-400 mt-1">Standard delivery takes 5-7 business days within India.</p>
                                </div>
                                <div className="border-t border-zinc-800 pt-3">
                                    <p className="text-sm font-medium text-zinc-200">Can I return my order?</p>
                                    <p className="text-xs text-zinc-400 mt-1">Yes! We offer 30-day hassle-free returns on all unworn items.</p>
                                </div>
                                <div className="border-t border-zinc-800 pt-3">
                                    <p className="text-sm font-medium text-zinc-200">Do you ship internationally?</p>
                                    <p className="text-xs text-zinc-400 mt-1">Currently we only ship within India. International coming soon!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
