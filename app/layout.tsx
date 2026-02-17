import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"

export const metadata: Metadata = {
  title: {
    default: "OUTLAW — Rebellious Fashion",
    template: "%s | OUTLAW",
  },
  description: "Premium streetwear for those who dare to stand out. Shop the OUTLAW collection — bold, rebellious, and unapologetically different.",
  keywords: ["streetwear", "fashion", "OUTLAW", "t-shirts", "clothing", "rebellious fashion", "premium streetwear"],
  openGraph: {
    title: "OUTLAW — Rebellious Fashion",
    description: "Premium streetwear for those who dare to stand out.",
    type: "website",
    siteName: "OUTLAW",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark antialiased">
      <body className="antialiased font-sans">
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Navbar />
              {children}
              <Footer />
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
