"use client"

import type React from "react"

import { useState } from "react"
import { OutlawButton } from "@/components/ui/outlaw-button"
import PasscodeKeypad from "./passcode-keypad"
import CinematicTransition from "./cinematic-transition"
import { signUpWithEmail, createProfile, checkOutlawIdExists } from "@/lib/auth"

export default function SignupForm() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [outlawId, setOutlawId] = useState("")
  const [vaultCode, setVaultCode] = useState("")
  const [showTransition, setShowTransition] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"details" | "identity">("details")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    console.log("[v0] Form submitted, step:", step)

    if (step === "details") {
      console.log("[v0] Moving to identity step")
      setStep("identity")
      return
    }

    setIsLoading(true)
    console.log("[v0] Starting signup process")

    try {
      // Check if outlaw_id already exists
      console.log("[v0] Checking if outlaw ID exists:", outlawId)
      const { exists } = await checkOutlawIdExists(outlawId)
      if (exists) {
        setError("This Outlaw ID is already taken")
        setIsLoading(false)
        return
      }

      // Create auth user with email and vault_code as password
      console.log("[v0] Creating auth user")
      const { data: authData, error: authError } = await signUpWithEmail(email, vaultCode)

      if (authError) {
        console.log("[v0] Auth error:", authError)
        setError(authError.message)
        setIsLoading(false)
        return
      }

      if (authData.user) {
        console.log("[v0] Creating profile")
        // Create profile record
        const { error: profileError } = await createProfile({
          id: authData.user.id,
          email,
          name,
          mobile,
          outlaw_id: outlawId,
        })

        if (profileError) {
          console.log("[v0] Profile error:", profileError)
          setError("Failed to create profile")
          setIsLoading(false)
          return
        }
      }

      console.log("[v0] Signup successful")
      setIsLoading(false)
      setShowTransition(true)
    } catch (err) {
      console.log("[v0] Unexpected error:", err)
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  const handleTransitionComplete = () => {
    window.location.href = "/"
  }

  if (showTransition) {
    return <CinematicTransition onComplete={handleTransitionComplete} />
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Join the Rebellion</h2>
        <p className="text-gray-400">{step === "details" ? "Enter your details" : "Create your outlaw identity"}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === "details" && (
          <div className="animate-in slide-in-from-left duration-300 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="Your outlaw name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mobile</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="Your mobile number"
                required
              />
            </div>
          </div>
        )}

        {step === "identity" && (
          <div className="animate-in slide-in-from-right duration-300 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Outlaw ID</label>
              <input
                type="text"
                value={outlawId}
                onChange={(e) => setOutlawId(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="Choose your unique outlaw ID"
                required
                minLength={3}
                maxLength={20}
              />
              <p className="text-xs text-gray-500 mt-1">
                3-20 characters, lowercase letters, numbers, and underscores only
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Vault Code</label>
              <PasscodeKeypad value={vaultCode} onChange={setVaultCode} />
              <p className="text-xs text-gray-500 mt-2">This will be your secret access code</p>
            </div>
          </div>
        )}

        <OutlawButton
          type="submit"
          className="w-full"
          disabled={
            isLoading ||
            (step === "details" && (!name || !email || !mobile)) ||
            (step === "identity" && (!outlawId || vaultCode.length < 4))
          }
        >
          {isLoading ? "Creating Identity..." : step === "details" ? "Continue" : "Join Rebellion"}
        </OutlawButton>

        {step === "identity" && (
          <button
            type="button"
            onClick={() => setStep("details")}
            className="w-full text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to details
          </button>
        )}
      </form>
    </div>
  )
}
