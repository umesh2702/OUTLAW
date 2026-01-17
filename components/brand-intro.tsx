"use client"

import { useEffect, useState } from "react"
import { BRAND_NAME } from "@/lib/constants"
import Image from "next/image"

export default function BrandIntro() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro")

    if (!hasSeenIntro) {
      setShow(true)
      sessionStorage.setItem("hasSeenIntro", "true")

      const timer = setTimeout(() => setShow(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 animate-in fade-in duration-300"
      onClick={() => setShow(false)}
      role="dialog"
      aria-label={`${BRAND_NAME} intro`}  
    >
      <h1 className="text-4xl font-semibold tracking-[0.3em] text-[color:var(--brand-accent)] md:text-6xl animate-in slide-in-from-bottom-4 duration-500">
        <Image src="/logo.png" alt={`${BRAND_NAME} Logo`} width={200} height={100} className="h-16 w-auto" priority />
      </h1>
    </div>
  )
}
