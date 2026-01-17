"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface CinematicTransitionProps {
  onComplete?: () => void
}

export default function CinematicTransition({ onComplete }: CinematicTransitionProps) {
  const [stage, setStage] = useState<"glitch" | "logo" | "fade">("glitch")

  useEffect(() => {
    const timer1 = setTimeout(() => setStage("logo"), 1000)
    const timer2 = setTimeout(() => setStage("fade"), 2500)
    const timer3 = setTimeout(() => onComplete?.(), 3500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden animate-in fade-in duration-300">
      {stage === "glitch" && (
        <div className="relative w-full h-full animate-in fade-in duration-100">
          {/* Glitch Effect Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-red-800">
            {/* Animated glitch lines */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-red-500 animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: "0.1s",
                }}
              />
            ))}
          </div>

          {/* Glitch Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-white animate-pulse">ACCESSING...</div>
          </div>
        </div>
      )}

      {stage === "logo" && (
        <div className="flex flex-col items-center justify-center animate-in zoom-in duration-800">
          <div className="relative w-64 h-32 mb-8 animate-pulse">
            <Image src="/logo.png" alt="OUTLAW" fill className="object-contain" />
          </div>

          <div className="text-2xl text-red-500 font-bold tracking-wider animate-in slide-in-from-bottom duration-500 delay-500">
            WELCOME TO THE UNDERGROUND
          </div>
        </div>
      )}

      {stage === "fade" && (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-red-900/20 to-black animate-in fade-in duration-1000" />
      )}
    </div>
  )
}
