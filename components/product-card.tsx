"use client"

import type React from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import { BRAND_ACCENT } from "@/lib/constants"

export type Product = {
  id: string
  name: string
  price: string
  imageSrc: string
  imageAlt: string
}

type Props = {
  product: Product
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  highlighted?: boolean
}

const sizeMap = {
  sm: 220,
  md: 280,
  lg: 340,
}

export default function ProductCard({ product, size = "md", onClick, highlighted = false }: Props) {
  const dimension = sizeMap[size]

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: highlighted ? 1.03 : 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col items-center focus:outline-none"
      aria-label={`View ${product.name}`}
      style={{ ["--brand-accent" as any]: BRAND_ACCENT } as React.CSSProperties}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-sm transition-shadow group-hover:shadow-md"
        style={{ width: dimension, height: dimension }}
      >
        <Image
          src={product.imageSrc || "/placeholder.svg?height=800&width=800&query=fashion%20product"}
          alt={product.imageAlt}
          fill
          sizes={`${dimension}px`}
          className="object-cover"
          priority={highlighted}
        />

        {/* subtle hover ring accent */}
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition-colors group-hover:ring-[color:var(--brand-accent)]/25" />
      </div>
      {/* Meta */}
      <div className="mt-3 text-center">
        <p className="text-sm font-medium text-zinc-100">{product.name}</p>
        <p className="text-sm text-zinc-400">{product.price}</p>
      </div>
    </motion.button>
  )
}
