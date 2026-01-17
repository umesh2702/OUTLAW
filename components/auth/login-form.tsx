"use client"

import type React from "react"

import { useState } from "react"
import { OutlawButton } from "@/components/ui/outlaw-button"
import PasscodeKeypad from "./passcode-keypad"
import CinematicTransition from "./cinematic-transition"
import { loginWithOutlawId } from "@/lib/auth"

export default function LoginForm() {
  const [outlawId, setOutlawId] = useState("")
  const [vaultCode, setVaultCode] = useState("")
  const [showTransition, setShowTransition] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("[v0] Login attempt with outlaw ID:", outlawId)

    try {
      const { data, error: loginError } = await loginWithOutlawId(outlawId, vaultCode)

      if (loginError) {
        console.log("[v0] Login error:", loginError)
        setError(loginError.message)
        setIsLoading(false)
        return
      }

      if (data?.user) {
        console.log("[v0] Login successful")
        setIsLoading(false)
        setShowTransition(true)
      } else {
        console.log("[v0] No user data returned")
        setError("Invalid Outlaw ID or Vault Code")
        setIsLoading(false)
      }
    } catch (err) {
      console.log("[v0] Unexpected login error:", err)
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
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400">Enter your outlaw credentials to access the vault</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Outlaw ID</label>
          <input
            type="text"
            value={outlawId}
            onChange={(e) => setOutlawId(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
            className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
            placeholder="Enter your outlaw ID"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Vault Code</label>
          <PasscodeKeypad value={vaultCode} onChange={setVaultCode} />
        </div>

        <OutlawButton type="submit" className="w-full" disabled={isLoading || !outlawId || vaultCode.length < 4}>
          {isLoading ? "Accessing Vault..." : "Enter Vault"}
        </OutlawButton>
      </form>
    </div>
  )
}
