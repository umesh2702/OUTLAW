"use client"

import Link from "next/link"
import Image from "next/image"
import { BRAND_NAME } from "@/lib/constants"
import { OutlawButton } from "@/components/ui/outlaw-button"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import ProfileDropdown from "@/components/profile-dropdown"
import { ShoppingCart, LayoutGrid } from "lucide-react"

export default function Navbar() {
  const { isLoggedIn, loading } = useAuth()
  const { cartCount } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/70 backdrop-blur after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:bg-[color:var(--brand-accent)]/35">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="font-semibold tracking-wider text-zinc-100">
          <span className="sr-only">Home</span>
          <Image src="/logo.png" alt={`${BRAND_NAME} Logo`} width={116} height={36} className="h-8 sm:h-9 w-auto" priority />
        </Link>

        {/* Right Side - All views */}
        <div className="flex items-center gap-1 sm:gap-4">
          {/* Catalog Link */}
          <Link
            href="/catalog"
            className="flex items-center gap-1.5 px-2 sm:px-3 py-2 text-zinc-400 hover:text-[color:var(--brand-accent)] transition-colors"
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Catalog</span>
          </Link>

          {/* Cart Link */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 px-2 sm:px-3 py-2 text-zinc-400 hover:text-[color:var(--brand-accent)] transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 sm:top-1 sm:-right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Profile / Login */}
          {isLoggedIn ? (
            <ProfileDropdown mobileView />
          ) : loading ? (
            <div className="w-8 h-8 animate-pulse bg-zinc-800 rounded-full" />
          ) : (
            <Link href="/auth" className="hidden sm:block">
              <OutlawButton aria-label="Enter OUTLAW" className="rounded-full px-4 py-2">
                Enter
              </OutlawButton>
            </Link>
          )}

          {/* Mobile Login Icon */}
          {!isLoggedIn && !loading && (
            <Link
              href="/auth"
              className="sm:hidden p-2 text-zinc-400 hover:text-white"
              aria-label="Sign In"
            >
              <div className="w-7 h-7 rounded-full border-2 border-red-500 flex items-center justify-center">
                <span className="text-xs font-bold text-red-400">?</span>
              </div>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
