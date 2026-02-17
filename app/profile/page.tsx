"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { User, Mail, Phone, Shield, Calendar, Package, ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function ProfilePage() {
    const router = useRouter()
    const { isLoggedIn, profile, user, loading: authLoading } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")
    const [form, setForm] = useState({
        name: "",
        mobile: "",
    })

    useEffect(() => {
        if (profile) {
            setForm({
                name: profile.name || "",
                mobile: profile.mobile || "",
            })
        }
    }, [profile])

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/auth")
        }
    }, [authLoading, isLoggedIn, router])

    const handleSave = async () => {
        if (!user) return
        setIsSaving(true)
        setError("")
        setSuccess("")

        try {
            const supabase = createClient()
            const { error: updateError } = await supabase
                .from("profiles")
                .update({
                    name: form.name,
                    mobile: form.mobile,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id)

            if (updateError) {
                setError("Failed to update profile. Please try again.")
            } else {
                setSuccess("Profile updated successfully!")
                setIsEditing(false)
                setTimeout(() => setSuccess(""), 3000)
            }
        } catch {
            setError("An unexpected error occurred.")
        } finally {
            setIsSaving(false)
        }
    }

    if (authLoading) {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-400" />
            </main>
        )
    }

    if (!isLoggedIn || !profile) {
        return null
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-red-400 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <h1 className="text-3xl font-bold mb-8">My Profile</h1>

                {/* Profile Card */}
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                    {/* Banner */}
                    <div className="h-24 bg-gradient-to-r from-red-500/20 via-zinc-900 to-red-500/10 relative">
                        <div className="absolute -bottom-10 left-6">
                            <div className="w-20 h-20 rounded-full bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center">
                                <User className="w-8 h-8 text-red-400" />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 pt-14 pb-6">
                        {/* Identity */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold">{profile.name || "Outlaw"}</h2>
                            <p className="text-sm text-zinc-400">@{profile.outlaw_id}</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
                                <Calendar className="w-5 h-5 text-red-400 mx-auto mb-2" />
                                <p className="text-xs text-zinc-400">Member Since</p>
                                <p className="text-sm font-semibold">{new Date(profile.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>
                            </div>
                            <Link href="/orders" className="bg-zinc-800/50 rounded-xl p-4 text-center hover:bg-zinc-800 transition-colors">
                                <Package className="w-5 h-5 text-red-400 mx-auto mb-2" />
                                <p className="text-xs text-zinc-400">My Orders</p>
                                <p className="text-sm font-semibold text-red-400">View →</p>
                            </Link>
                        </div>

                        {/* Success / Error Messages */}
                        {success && (
                            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                                {success}
                            </div>
                        )}
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Profile Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Account Details</h3>

                            {/* Name */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/30 border border-zinc-800">
                                <User className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-zinc-500 mb-0.5">Full Name</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-red-500 focus:outline-none"
                                        />
                                    ) : (
                                        <p className="text-sm font-medium">{profile.name || "Not set"}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/30 border border-zinc-800">
                                <Mail className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-zinc-500 mb-0.5">Email</p>
                                    <p className="text-sm font-medium">{profile.email}</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">Locked</span>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/30 border border-zinc-800">
                                <Phone className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-zinc-500 mb-0.5">Mobile</p>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={form.mobile}
                                            onChange={(e) => setForm(prev => ({ ...prev, mobile: e.target.value }))}
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-red-500 focus:outline-none"
                                        />
                                    ) : (
                                        <p className="text-sm font-medium">{profile.mobile || "Not set"}</p>
                                    )}
                                </div>
                            </div>

                            {/* Outlaw ID */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/30 border border-zinc-800">
                                <Shield className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-zinc-500 mb-0.5">Outlaw ID</p>
                                    <p className="text-sm font-medium">@{profile.outlaw_id}</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">Locked</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false)
                                            setForm({
                                                name: profile.name || "",
                                                mobile: profile.mobile || "",
                                            })
                                        }}
                                        className="px-4 py-2.5 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 px-4 py-2.5 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
