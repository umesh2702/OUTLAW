"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { User, Settings, Package, LogOut, ChevronDown } from "lucide-react"

interface ProfileDropdownProps {
  mobileView?: boolean
}

export default function ProfileDropdown({ mobileView = false }: ProfileDropdownProps) {
  const { profile, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    console.log("Logout clicked")
    setIsOpen(false)

    // Clear all localStorage items related to Supabase and our app
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.includes('supabase') || key.includes('outlaw') || key.includes('sb-'))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))

    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })

    // Call signOut
    try {
      await signOut()
    } catch (e) {
      console.error("SignOut error:", e)
    }

    // Force hard redirect
    window.location.replace("/")
  }

  const displayName = profile?.outlaw_id || "User"
  const userName = profile?.name || "Outlaw"

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button - Mobile or Desktop */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className={`flex items-center cursor-pointer transition-colors ${mobileView
            ? "p-2 text-zinc-400 hover:text-white"
            : "gap-2 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-red-500/50 text-zinc-300 hover:text-white"
          }`}
      >
        <div className={`rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center ${mobileView ? "w-7 h-7" : "w-8 h-8"
          }`}>
          <User className={`text-red-400 ${mobileView ? "w-3.5 h-3.5" : "w-4 h-4"}`} />
        </div>
        {!mobileView && (
          <>
            <span className="text-sm font-medium">{displayName}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Profile Header */}
          <div className="px-4 py-3 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <User className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-zinc-400">@{displayName}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer">
              <Package className="w-4 h-4" />
              Your Orders
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-zinc-800 py-2">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
