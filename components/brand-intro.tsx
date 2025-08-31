"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BRAND_NAME } from "@/lib/constants"
import Image from "next/image"

export default function BrandIntro() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShow(false)}
          role="dialog"
          aria-label={`${BRAND_NAME} intro`}
        >
          <motion.h1
            className="text-4xl font-semibold tracking-[0.3em] text-[color:var(--brand-accent)] md:text-6xl"
            initial={{ letterSpacing: "0.5em", opacity: 0, y: 10 }}
            animate={{ letterSpacing: "0.3em", opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          >
          <Image src="/logo.png" alt={`${BRAND_NAME} Logo`} width={200} height={100} className="h-16 w-auto" priority />
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
