import HeroSection from "@/components/hero-section"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Truck, Shield, RotateCcw, Sparkles } from "lucide-react"

async function getFeaturedProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4)
  return data || []
}

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from("products").select("category")
  if (!data) return []
  return [...new Set(data.map((p) => p.category))]
}

export default async function Page() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <main>
      <HeroSection />

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="bg-zinc-950 border-t border-zinc-800/50">
          <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-3">
                  <Sparkles className="w-3 h-3 text-red-400" />
                  <span className="text-xs font-medium text-red-400">New Drops</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-white">Fresh Off the Line</h2>
              </div>
              <Link
                href="/catalog"
                className="hidden sm:flex items-center gap-2 text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/catalog/${product.id}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-zinc-900 border border-zinc-800/50 transition-all duration-500 group-hover:border-red-500/30 group-hover:shadow-xl group-hover:shadow-red-500/5">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={product.image_url || "/images/outlaw-tee-skull-graphic.png"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50">
                        <span className="text-sm sm:text-lg font-bold text-red-400">₹{product.price}</span>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-red-400/80 mb-1">
                        {product.category}
                      </p>
                      <h3 className="text-sm sm:text-base font-bold text-zinc-100 group-hover:text-white transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="sm:hidden mt-4 text-center">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-medium text-sm transition-colors"
              >
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Shop by Category */}
      {categories.length > 0 && (
        <section className="bg-zinc-950 border-t border-zinc-800/50">
          <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">Shop by Category</h2>
              <p className="text-zinc-400">Find your style in our curated collections</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/catalog`}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 p-6 sm:p-8 text-center hover:border-red-500/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors duration-300" />
                  <h3 className="text-lg sm:text-xl font-bold capitalize text-zinc-100 group-hover:text-white transition-colors relative z-10">
                    {category}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1 relative z-10">
                    Browse Collection →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Values */}
      <section className="bg-zinc-950 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Free Shipping</h3>
              <p className="text-sm text-zinc-400">Free delivery on all orders across India</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Secure Payments</h3>
              <p className="text-sm text-zinc-400">100% secure checkout via Razorpay</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Easy Returns</h3>
              <p className="text-sm text-zinc-400">30-day hassle-free return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-zinc-950 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-500/20 via-zinc-900 to-zinc-900 border border-red-500/20 p-8 sm:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
                Join the <span className="text-red-400">OUTLAW</span> Movement
              </h2>
              <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-8">
                Be bold. Be different. Be an outlaw.
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-8 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-all hover:shadow-xl hover:shadow-red-500/20"
              >
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
