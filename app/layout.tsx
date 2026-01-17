import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
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
