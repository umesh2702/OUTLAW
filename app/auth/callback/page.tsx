import { createClient } from "@/lib/supabase"
import { redirect } from "next/navigation"

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: { code: string }
}) {
  const supabase = createClient()

  if (searchParams.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(searchParams.code)

    if (!error) {
      redirect("/")
    }
  }

  // Return the user to an error page with instructions
  redirect("/auth?error=Could not authenticate user")
}
