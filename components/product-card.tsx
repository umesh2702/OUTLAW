"use client"

import type React from "react"
import Image from "next/image"
import { BRAND_ACCENT } from "@/lib/constants"
import type { Product } from "@/types/product"

type Props = {
  product: Product
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  highlighted?: boolean
}

const sizeMap = {
  sm: 200,
  md: 260,
  lg: 320,
}

export default function ProductCard({ product, size = "md", onClick, highlighted = false }: Props) {
  const dimension = sizeMap[size]

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center focus:outline-none transition-transform duration-300 hover:scale-105 hover:-translate-y-2"
      aria-label={`View ${product.name}`}
      style={{ ["--brand-accent" as any]: BRAND_ACCENT } as React.CSSProperties}
    >
      {/* Enhanced container with better shadows and effects */}
      <div
        className="relative overflow-hidden rounded-3xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:border-[color:var(--brand-accent)]/30"
        style={{ width: dimension, height: dimension }}
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-zinc-900/20" />

        {/* Product image */}
        <Image
          src={product.image_url || `/placeholder.svg?height=800&width=800&query=${encodeURIComponent(product.name)}`}
          alt={product.name}
          fill
          sizes={`${dimension}px`}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority={highlighted}
        />

        {/* Enhanced hover effects */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`,
            }}
          />

          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-[color:var(--brand-accent)]/60 rounded-tl-lg" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-[color:var(--brand-accent)]/60 rounded-br-lg" />
        </div>

        {/* Subtle ring accent */}
        <span className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition-all duration-500 group-hover:ring-[color:var(--brand-accent)]/40 group-hover:ring-2" />
      </div>

      {/* Enhanced product meta */}
      <div className="mt-4 text-center">
        <p className="text-base font-semibold text-zinc-100 group-hover:text-[color:var(--brand-accent)] transition-colors duration-300">
          {product.name}
        </p>
        <p className="text-sm text-zinc-400 mt-1 font-medium">${product.price}</p>
        <p className="text-xs text-zinc-500 mt-1">{product.category}</p>

        {/* Stock indicator */}
        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
          <p className="text-xs text-amber-400 mt-1">Only {product.stock_quantity} left!</p>
        )}
        {product.stock_quantity === 0 && <p className="text-xs text-red-400 mt-1">Out of Stock</p>}
      </div>
    </button>
  )
}
