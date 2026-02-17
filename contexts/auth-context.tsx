"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  email: string
  name: string
  mobile: string
  outlaw_id: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  isLoggedIn: boolean
  signOut: () => Promise<void>
  supabase: ReturnType<typeof createClient>
}

const AUTH_STORAGE_KEY = "outlaw_auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper to check if we have a stored auth state
function getStoredAuthState(): { isLoggedIn: boolean; profile: Profile | null } {
  if (typeof window === "undefined") {
    return { isLoggedIn: false, profile: null }
  }
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { isLoggedIn: true, profile: parsed.profile || null }
    }
  } catch {
    // Ignore parsing errors
  }
  return { isLoggedIn: false, profile: null }
}

// Helper to save auth state
function saveAuthState(profile: Profile | null) {
  if (typeof window === "undefined") return
  try {
    if (profile) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ profile, timestamp: Date.now() }))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize from localStorage to prevent flash
  const initialState = getStoredAuthState()

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(initialState.profile)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(initialState.isLoggedIn)

  // Create client once
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    let isMounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!isMounted) return

        setUser(session?.user ?? null)
        setIsLoggedIn(!!session?.user)

        if (session?.user) {
          // Fetch user profile
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (isMounted && profileData) {
            setProfile(profileData)
            saveAuthState(profileData)
          }
        } else {
          // Not logged in - clear storage
          setProfile(null)
          setIsLoggedIn(false)
          saveAuthState(null)
        }
      } catch (error) {
        console.error("Error checking auth session:", error)
        // On error, don't clear existing state - user might just have network issues
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return

      setUser(session?.user ?? null)
      setIsLoggedIn(!!session?.user)

      if (session?.user) {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (isMounted && profileData) {
          setProfile(profileData)
          saveAuthState(profileData)
        }
      } else {
        setProfile(null)
        saveAuthState(null)
      }

      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    console.log("AuthContext: signOut called")

    // Clear local state IMMEDIATELY to update UI
    setUser(null)
    setProfile(null)
    setIsLoggedIn(false)
    saveAuthState(null)
    setLoading(false) // Force loading to false to show "Enter" button immediately

    try {
      // Use scope: 'global' to sign out from all tabs/windows
      // We don't await this because if it hangs, we still want the UI to update
      supabase.auth.signOut({ scope: 'global' }).then(({ error }) => {
        if (error) console.error("AuthContext: signOut error:", error)
        else console.log("AuthContext: supabase signOut completed")
      })
    } catch (error) {
      console.error("AuthContext: signOut exception:", error)
    }
    console.log("AuthContext: state cleared")
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, isLoggedIn, signOut, supabase }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
