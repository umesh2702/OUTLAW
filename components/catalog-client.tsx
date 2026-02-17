"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles, Search, X } from "lucide-react"
import type { Product } from "@/types/product"

function ProductCard({ product }: { product: Product }) {
    return (
        <Link
            href={`/catalog/${product.id}`}
            className="group relative block"
        >
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-800/50 transition-all duration-500 group-hover:border-red-500/30 group-hover:shadow-2xl group-hover:shadow-red-500/10">
                <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                        src={product.image_url || "/images/outlaw-tee-skull-graphic.png"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
                    <div className="absolute inset-0 bg-red-500/0 transition-colors duration-500 group-hover:bg-red-500/10" />

                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50">
                        <span className="text-sm sm:text-lg font-bold text-red-400">₹{product.price}</span>
                    </div>

                    {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                        <div className="hidden sm:block absolute top-4 left-4 px-2 py-1 rounded-full bg-orange-500/90 backdrop-blur-sm">
                            <span className="text-xs font-semibold text-white">Only {product.stock_quantity} left!</span>
                        </div>
                    )}

                    <div className="hidden sm:block absolute bottom-4 left-4 right-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-semibold">
                            <span>View Details</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                <div className="p-3 sm:p-5">
                    <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-red-400/80 mb-1 sm:mb-2">
                        {product.category}
                    </p>
                    <h3 className="text-sm sm:text-lg font-bold text-zinc-100 group-hover:text-white transition-colors line-clamp-2 sm:line-clamp-1">
                        {product.name}
                    </h3>
                    {product.description && (
                        <p className="hidden sm:block mt-2 text-sm text-zinc-400 line-clamp-2">
                            {product.description}
                        </p>
                    )}
                </div>

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

interface CatalogClientProps {
    products: Product[]
    categories: string[]
}

export default function CatalogClient({ products, categories }: CatalogClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const filteredProducts = useMemo(() => {
        let result = products

        // Filter by category
        if (selectedCategory) {
            result = result.filter((p) => p.category === selectedCategory)
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.description?.toLowerCase().includes(query) ||
                    p.category.toLowerCase().includes(query)
            )
        }

        return result
    }, [products, selectedCategory, searchQuery])

    return (
        <>
            {/* Category Filters + Search */}
            <div className="sticky top-[57px] sm:top-[65px] z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
                <div className="mx-auto max-w-6xl px-4 py-4">
                    {/* Search Bar */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Category Pills */}
                    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${selectedCategory === null
                                    ? "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20"
                                    : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                                }`}
                        >
                            All Products
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                                className={`flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all capitalize cursor-pointer ${selectedCategory === category
                                        ? "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20"
                                        : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="mx-auto max-w-6xl px-3 sm:px-4 py-6 sm:py-12">
                {/* Results count */}
                {(searchQuery || selectedCategory) && (
                    <p className="text-sm text-zinc-400 mb-4">
                        {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
                        {selectedCategory && <span className="capitalize"> in {selectedCategory}</span>}
                        {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
                    </p>
                )}

                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-24 h-24 rounded-full bg-zinc-800/50 flex items-center justify-center mb-6">
                            <Sparkles className="w-10 h-10 text-zinc-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-100 mb-2">
                            {searchQuery || selectedCategory ? "No Results Found" : "No Products Yet"}
                        </h3>
                        <p className="text-zinc-400 text-center max-w-md">
                            {searchQuery || selectedCategory
                                ? "Try adjusting your search or filter to find what you're looking for."
                                : "Our vault is being restocked with premium rebellious gear. Check back soon for new arrivals!"}
                        </p>
                        {(searchQuery || selectedCategory) && (
                            <button
                                onClick={() => {
                                    setSearchQuery("")
                                    setSelectedCategory(null)
                                }}
                                className="mt-6 px-6 py-2.5 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 transition-colors cursor-pointer"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
