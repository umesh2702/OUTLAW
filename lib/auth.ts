import { createClient } from "./supabase"
import type { Profile } from "./supabase"

export async function signUpWithEmail(email: string, password: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
    },
  })

  return { data, error }
}

export async function createProfile(profileData: {
  id: string
  email: string
  name: string
  mobile: string
  outlaw_id: string
}) {
  const supabase = createClient()
  return supabase.from("profiles").insert([profileData]).select().single()
}


export async function loginWithOutlawId(outlawId: string, vaultCode: string) {
  const supabase = createClient()

  // Find email linked to outlaw_id
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("email")
    .eq("outlaw_id", outlawId)
    .single()

  if (profileError || !profile) {
    return { data: null, error: { message: "Invalid Outlaw ID or Vault Code" } }
  }

  // Authenticate using Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password: vaultCode,
  })

  if (error) {
    return { data: null, error: { message: "Invalid Outlaw ID or Vault Code" } }
  }

  return { data, error: null }
}


export async function checkOutlawIdExists(outlawId: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("profiles").select("outlaw_id").eq("outlaw_id", outlawId).single()

  return { exists: !!data, error }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}
