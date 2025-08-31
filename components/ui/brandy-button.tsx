"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { BRAND_ACCENT } from "@/lib/constants"

type Props = {
  children: React.ReactNode
  className?: string
  href?: string
  "aria-label"?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>

export function BrandyButton({ children, className, href, ...props }: Props) {
  const Comp: any = href ? motion.a : motion.button

  return (
    <Comp
      href={href}
      whileHover={{ y: -1, boxShadow: "0 10px 30px rgba(201, 122, 64, 0.15)" }}
      whileTap={{ y: 0, scale: 0.98 }}
      className={cn(
        "group relative inline-flex items-center justify-center rounded-full px-5 py-2.5",
        "bg-zinc-900 text-zinc-100 border border-zinc-700/80",
        "transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--brand-accent)] focus-visible:ring-offset-zinc-950",
        "hover:border-[color:var(--brand-accent)]/50",
        className,
      )}
      style={{ ["--brand-accent" as any]: BRAND_ACCENT } as React.CSSProperties}
      {...props}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-[color:var(--brand-accent)]/20"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden
      >
        <span className="absolute left-2 top-2 size-1 rounded-full bg-[color:var(--brand-accent)]/60" />
        <span className="absolute right-2 bottom-2 size-1 rounded-full bg-[color:var(--brand-accent)]/60" />
      </span>
      <span className="relative flex items-center gap-2">
        {children}
        <svg
          className="size-4 -mr-0.5 transition-transform group-hover:translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
    </Comp>
  )
}
