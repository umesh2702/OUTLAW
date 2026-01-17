"use client"

import type React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type OutlawButtonProps = {
  href?: string
  className?: string
  children: React.ReactNode
  "aria-label"?: string
}

const base =
  "relative inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium " +
  "text-[color:var(--brand-accent-foreground)] bg-[color:var(--brand-accent)] " +
  "ring-1 ring-inset ring-[color:var(--brand-accent)]/40 shadow-[0_8px_24px_-6px_rgba(225,29,46,.5)] " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-accent)] transition-[box-shadow,transform] overflow-hidden"

const sheen =
  "before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,.22),transparent)] " +
  "hover:before:translate-x-full before:transition-transform before:duration-700"

export function OutlawButton({ href, className, children, ...rest }: OutlawButtonProps & React.ComponentProps<typeof motion.button>) {
  if (href) {
    return (
      <Link href={href} legacyBehavior passHref>
        <motion.a
          whileHover={{ y: -1.5, scale: 1.015 }}
          whileTap={{ y: 0, scale: 0.985 }}
          className={cn(base, sheen, className)}
          {...(rest as any)}
        >
          {children}
        </motion.a>
      </Link>
    )
  }

  return (
    <motion.button
      whileHover={{ y: -1.5, scale: 1.015 }}
      whileTap={{ y: 0, scale: 0.985 }}
      className={cn(base, sheen, className)}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
