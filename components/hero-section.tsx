"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import ProductCard, { type Product } from "./product-card"
import { OutlawButton } from "@/components/ui/outlaw-button"
import imag from "../public/images/hoodie1.png"

const MotionImage = motion(Image)

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Sculpt Sneaker",
    price: "$220",
    imageSrc: imag,
    imageAlt: "Sleek monochrome fashion sneaker on neutral backdrop",
  },
  {
    id: "2",
    name: "Outlaw Hoodie",
    price: "$180",
    imageSrc: imag,
    imageAlt: "Outlaw black hoodie, isolated",
  },
  {
    id: "3",
    name: "Edge Jacket",
    price: "$420",
    imageSrc: imag,
    imageAlt: "Modern tailored black jacket",
  },
]

function RotatingCenterProduct({ product }: { product: Product }) {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div className="relative" style={{ perspective: 1000 }}>
        <MotionImage
          src={product.imageSrc}
          alt={product.imageAlt}
          className="h-[320px] w-auto select-none rounded-lg object-contain md:h-[380px]"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{
            duration: 12,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      </div>
    </div>
  )
}

export default function HeroSection() {
  const [centerIndex, setCenterIndex] = useState(1) // middle product highlighted

  const { left, center, right } = useMemo(() => {
    const len = initialProducts.length
    const c = centerIndex % len
    return {
      left: initialProducts[(c + len - 1) % len],
      center: initialProducts[c],
      right: initialProducts[(c + 1) % len],
    }
  }, [centerIndex])

  const moveLeftToCenter = () =>
    setCenterIndex((i) => (i + initialProducts.length - 1) % initialProducts.length)

  const moveRightToCenter = () =>
    setCenterIndex((i) => (i + 1) % initialProducts.length)

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      {/* Headline */}
      <div className="mb-8 flex flex-col items-center text-center">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight text-zinc-100 md:text-5xl">
          Our Hero Items
        </h1>

      </div>

      {/* Products Row */}
      <div className="grid grid-cols-1 items-end justify-items-center gap-8 md:grid-cols-3">
        {/* Left product */}
        <motion.div
          className="order-2 md:order-1 md:-translate-y-6 md:-translate-x-6"
          initial={false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
        >
          <ProductCard product={left} size="sm" onClick={moveLeftToCenter} />
        </motion.div>

        {/* Center product */}
        <div className="order-1 md:order-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={center.id}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              className="flex flex-col items-center"
            >
              <RotatingCenterProduct product={center} />

              {/* CTA */}
              <div className="mt-6">
                <OutlawButton aria-label="Shop now">Shop Now</OutlawButton>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right product */}
        <motion.div
          className="order-3 md:-translate-y-6 md:translate-x-6"
          initial={false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
        >
          <ProductCard product={right} size="sm" onClick={moveRightToCenter} />
        </motion.div>
      </div>
    </section>
  )
}
