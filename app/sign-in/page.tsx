import { BrandyButton } from "@/components/ui/brandy-button"

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-2xl font-semibold text-zinc-100">Sign In</h1>
      <p className="mt-3 text-sm text-zinc-400">Authentication to be implemented. This is a placeholder page.</p>
      <form className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm text-zinc-300">Email</span>
          <input
            type="email"
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[color:var(--brand-accent)]"
            placeholder="you@example.com"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-zinc-300">Password</span>
          <input
            type="password"
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[color:var(--brand-accent)]"
            placeholder="••••••••"
          />
        </label>
        <BrandyButton type="button" aria-label="Sign in">
          Sign In
        </BrandyButton>
      </form>
    </main>
  )
}
