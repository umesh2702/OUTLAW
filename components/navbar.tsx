import Link from "next/link"
import Image from "next/image"
import { BRAND_NAME } from "@/lib/constants"
import { OutlawButton } from "@/components/ui/outlaw-button"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/70 backdrop-blur after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:bg-[color:var(--brand-accent)]/35">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-wider text-zinc-100">
          <span className="sr-only">Home</span>
          <Image src="/logo.png" alt={`${BRAND_NAME} Logo`} width={116} height={36} className="h-9 w-auto" priority />
        </Link>

        <ul className="flex items-center gap-6 text-sm text-zinc-400">
          {/* Removed Home link */}
          <li>
            <Link href="/catalog" className="transition-colors hover:text-[color:var(--brand-accent)]">
              Catalog
            </Link>
          </li>
          <li>
            <Link href="/cart" className="transition-colors hover:text-[color:var(--brand-accent)]">
              Cart
            </Link>
          </li>
        </ul>

        {/* Single unique sign-in CTA */}
        <div className="flex items-center">
          <OutlawButton href="/sign-in" aria-label="Enter OUTLAW" className="rounded-full px-4 py-2">
            Enter
          </OutlawButton>
        </div>
      </nav>
    </header>
  )
}
