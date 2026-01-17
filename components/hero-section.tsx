"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/types/product"
import { OutlawButton } from "@/components/ui/outlaw-button"

const MotionImage = motion(Image)

// Static products for hero display
const heroProducts: Product[] = [
  {
    id: "hero-1",
    name: "Skull Graphic Tee",
    price: 55,
    image_url: "/images/outlaw-tee-skull-graphic.png",
    category: "t-shirt",
    description: "Black streetwear t-shirt with bold skull graphic",
    stock_quantity: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "hero-2",
    name: "Outlaw Logo Tee",
    price: 45,
    image_url: "/images/outlaw-tee-minimal-logo.png",
    category: "t-shirt",
    description: "Premium black t-shirt with minimalist red logo",
    stock_quantity: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "hero-3",
    name: "Vintage Distressed Tee",
    price: 60,
    image_url: "/images/outlaw-tee-vintage-distressed.png",
    category: "t-shirt",
    description: "Distressed vintage-wash grey t-shirt",
    stock_quantity: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

function RotatingCenterProduct({ product }: { product: Product }) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Glow effect */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-40"
        style={{
          background: `radial-gradient(circle at center, var(--brand-accent) 0%, transparent 70%)`,
          filter: "blur(60px)",
          transform: "scale(1.5)",
        }}
        aria-hidden="true"
      />

      {/* Floating particles */}
      <div className="absolute inset-0 -z-5">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[color:var(--brand-accent)] rounded-full opacity-30"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + i * 5}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative" style={{ perspective: 1000 }}>
        <MotionImage
          src={product.image_url || "/images/outlaw-tee-skull-graphic.png"}
          alt={product.description || product.name}
          width={500}
          height={500}
          priority
          className="h-[380px] w-auto select-none rounded-2xl object-contain md:h-[420px] shadow-2xl"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{
            duration: 15,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
          style={{
            filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))",
          }}
        />

        {/* Reflection effect */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full h-8 opacity-20"
          style={{
            background: `linear-gradient(to bottom, var(--brand-accent), transparent)`,
            filter: "blur(8px)",
            transform: "translateX(-50%) scaleY(-1)",
          }}
        />
      </div>
    </div>
  )
}

type SideProductCardProps = {
  product: Product
  onClick: () => void
}

function SideProductCard({ product, onClick }: SideProductCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative flex flex-col items-center focus:outline-none"
      whileHover={{
        scale: 1.05,
        y: -10,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="relative overflow-hidden rounded-3xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:border-[color:var(--brand-accent)]/30"
        style={{ width: 220, height: 220 }}
      >
        <Image
          src={product.image_url || "/images/outlaw-tee-skull-graphic.png"}
          alt={product.name}
          fill
          sizes="220px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Shimmer on hover */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`,
            }}
          />
        </div>
        <span className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition-all duration-500 group-hover:ring-[color:var(--brand-accent)]/40 group-hover:ring-2" />
      </div>
      <p className="mt-4 text-base font-semibold text-zinc-100 group-hover:text-[color:var(--brand-accent)] transition-colors duration-300">
        {product.name}
      </p>
      <p className="text-sm text-zinc-400 mt-1 font-medium">${product.price}</p>
      {/* Subtle glow */}
      <div
        className="absolute inset-0 -z-10 rounded-2xl opacity-20"
        style={{
          background: `radial-gradient(circle at center, var(--brand-accent) 0%, transparent 60%)`,
          filter: "blur(30px)",
        }}
      />
    </motion.button>
  )
}

export default function HeroSection() {
  const [centerIndex, setCenterIndex] = useState(0)

  const { left, center, right } = useMemo(() => {
    const len = heroProducts.length
    const c = centerIndex % len
    return {
      left: heroProducts[(c + len - 1) % len],
      center: heroProducts[c],
      right: heroProducts[(c + 1) % len],
    }
  }, [centerIndex])

  const moveLeftToCenter = () => setCenterIndex((i) => (i + heroProducts.length - 1) % heroProducts.length)
  const moveRightToCenter = () => setCenterIndex((i) => (i + 1) % heroProducts.length)

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-8 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full"
            style={{
              background: `radial-gradient(circle, var(--brand-accent) 0%, transparent 70%)`,
              filter: "blur(80px)",
            }}
            animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full"
            style={{
              background: `radial-gradient(circle, var(--brand-accent) 0%, transparent 70%)`,
              filter: "blur(100px)",
            }}
            animate={{ x: [0, -80, 0], y: [0, 60, 0], scale: [1, 0.8, 1] }}
            transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </div>

        {/* Floating orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-20"
            style={{
              background: `var(--brand-accent)`,
              left: `${15 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 8 + i * 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Headline */}
        <motion.div
          className="mb-6 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-pretty text-4xl font-bold tracking-tight text-zinc-100 md:text-6xl lg:text-7xl"
            style={{
              background: `linear-gradient(135deg, #ffffff 0%, var(--brand-accent) 50%, #ffffff 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% 200%",
            }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            Signature Collection
          </motion.h1>
        </motion.div>

        {/* Products display */}
        <div className="relative">
          {/* Background accent for center product */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] -z-10">
            <motion.div
              className="w-full h-full rounded-full opacity-10"
              style={{
                background: `conic-gradient(from 0deg, var(--brand-accent), transparent, var(--brand-accent))`,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </div>

          <div className="grid grid-cols-1 items-end justify-items-center gap-12 md:grid-cols-3">
            {/* Left product - clickable to swap */}
            <div className="order-2 md:order-1">
              <SideProductCard product={left} onClick={moveLeftToCenter} />
            </div>

            {/* Center product */}
            <div className="order-1 md:order-2 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={center.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 120, damping: 16 }}
                  className="flex flex-col items-center"
                >
                  <RotatingCenterProduct product={center} />

                  {/* Product info */}
                  <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold text-zinc-100 mb-2">{center.name}</h3>
                    <p className="text-3xl font-bold text-[color:var(--brand-accent)] mb-6">${center.price}</p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                      <OutlawButton href="/catalog" aria-label="Shop now" className="px-8 py-3 text-base">
                        Shop Now
                      </OutlawButton>
                      <Link
                        href="/catalog"
                        className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors underline underline-offset-4"
                      >
                        View All Products
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right product - clickable to swap */}
            <div className="order-3">
              <SideProductCard product={right} onClick={moveRightToCenter} />
            </div>
          </div>

          {/* Navigation dots */}
          <motion.div
            className="flex justify-center mt-12 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {heroProducts.map((_, index) => (
              <motion.button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === centerIndex % heroProducts.length ? "bg-[color:var(--brand-accent)] shadow-lg" : "bg-zinc-700 hover:bg-zinc-600"
                  }`}
                onClick={() => setCenterIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`View product ${index + 1}`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
