import Link from "next/link"
import { BRAND_NAME } from "@/lib/constants"

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
        <p className="text-sm text-zinc-400">
          © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-sm text-zinc-400">
          <Link href="/catalog" className="transition-colors hover:text-[color:var(--brand-accent)]">
            Catalog
          </Link>
          <Link href="/cart" className="transition-colors hover:text-[color:var(--brand-accent)]">
            Cart
          </Link>
          <Link href="/sign-in" className="transition-colors hover:text-[color:var(--brand-accent)]">
            Sign In
          </Link>
        </div>
      </div>
    </footer>
  )
}
