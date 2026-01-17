import { createBrowserClient } from "@supabase/ssr"

export const createClient = () => {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export type Profile = {
  id: string
  email: string
  name: string | null
  mobile: string | null
  outlaw_id: string
  vault_code: string
}
