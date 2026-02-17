import Link from "next/link"
import { BRAND_NAME } from "@/lib/constants"

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-bold text-white mb-3">{BRAND_NAME}</h3>
            <p className="text-sm text-zinc-400">
              Rebellious fashion for those who dare to stand out.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/catalog" className="hover:text-red-400 transition-colors">
                  Catalog
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-red-400 transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/auth" className="hover:text-red-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-red-400 transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-red-400 transition-colors">
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/privacy" className="hover:text-red-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-red-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="hover:text-red-400 transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-800 pt-6 text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
