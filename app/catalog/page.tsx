import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/types/product"
import { Sparkles } from "lucide-react"
import CatalogClient from "@/components/catalog-client"

export const metadata = {
  title: "Catalog",
  description: "Browse the OUTLAW collection — bold, rebellious streetwear for those who dare to stand out.",
}

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return products || []
}

export default async function CatalogPage() {
  const products = await getProducts()
  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, var(--brand-accent) 0%, transparent 70%)",
              filter: "blur(100px)",
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, var(--brand-accent) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">Premium Collection</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 sm:mb-6">
              <span className="text-zinc-100">The </span>
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
                }}
              >
                OUTLAW
              </span>
              <span className="text-zinc-100"> Vault</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed px-4 sm:px-0">
              Discover our exclusive collection of rebellious fashion.
              Each piece crafted for those who dare to stand out.
            </p>

            <div className="flex items-center gap-4 sm:gap-8 mt-6 sm:mt-10 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-red-400">{products.length}</p>
                <p className="text-xs sm:text-sm text-zinc-500 uppercase tracking-wider">Products</p>
              </div>
              <div className="w-px h-8 sm:h-10 bg-zinc-800" />
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-red-400">{categories.length}</p>
                <p className="text-xs sm:text-sm text-zinc-500 uppercase tracking-wider">Categories</p>
              </div>
              <div className="w-px h-8 sm:h-10 bg-zinc-800" />
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-red-400">24/7</p>
                <p className="text-xs sm:text-sm text-zinc-500 uppercase tracking-wider">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client-side interactive section */}
      <CatalogClient products={products} categories={categories} />
    </div>
  )
}
