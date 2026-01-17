import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/types/product"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"

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

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/catalog/${product.id}`}
      className="group relative block"
    >
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-800/50 transition-all duration-500 group-hover:border-red-500/30 group-hover:shadow-2xl group-hover:shadow-red-500/10">

        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={product.image_url || "/images/outlaw-tee-skull-graphic.png"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-red-500/0 transition-colors duration-500 group-hover:bg-red-500/10" />

          {/* Price Tag */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50">
            <span className="text-sm sm:text-lg font-bold text-red-400">${product.price}</span>
          </div>

          {/* Stock Badge - Hidden on mobile */}
          {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
            <div className="hidden sm:block absolute top-4 left-4 px-2 py-1 rounded-full bg-orange-500/90 backdrop-blur-sm">
              <span className="text-xs font-semibold text-white">Only {product.stock_quantity} left!</span>
            </div>
          )}

          {/* Quick View Button - Hidden on mobile */}
          <div className="hidden sm:block absolute bottom-4 left-4 right-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-semibold">
              <span>View Details</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-5">
          {/* Category */}
          <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-red-400/80 mb-1 sm:mb-2">
            {product.category}
          </p>

          {/* Name */}
          <h3 className="text-sm sm:text-lg font-bold text-zinc-100 group-hover:text-white transition-colors line-clamp-2 sm:line-clamp-1">
            {product.name}
          </h3>

          {/* Description - Hidden on mobile */}
          {product.description && (
            <p className="hidden sm:block mt-2 text-sm text-zinc-400 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
            }}
          />
        </div>
      </div>
    </Link>
  )
}

export default async function CatalogPage() {
  const products = await getProducts()
  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-zinc-800">
        {/* Background Effects */}
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
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">Premium Collection</span>
            </div>

            {/* Title */}
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

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed px-4 sm:px-0">
              Discover our exclusive collection of rebellious fashion.
              Each piece crafted for those who dare to stand out.
            </p>

            {/* Stats */}
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

      {/* Category Filters */}
      <div className="sticky top-[57px] sm:top-[65px] z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1">
            <button className="flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-red-500 text-white text-xs sm:text-sm font-semibold transition-all hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20 cursor-pointer">
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className="flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-zinc-800/80 text-zinc-300 text-xs sm:text-sm font-medium transition-all hover:bg-zinc-700 hover:text-white capitalize cursor-pointer"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-6 sm:py-12">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-24 h-24 rounded-full bg-zinc-800/50 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-100 mb-2">No Products Yet</h3>
            <p className="text-zinc-400 text-center max-w-md">
              Our vault is being restocked with premium rebellious gear. Check back soon for new arrivals!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
