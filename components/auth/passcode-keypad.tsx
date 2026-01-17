"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface PasscodeKeypadProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
}

export default function PasscodeKeypad({ value, onChange, maxLength = 6 }: PasscodeKeypadProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const handleKeyPress = (digit: string) => {
    if (value.length < maxLength) {
      onChange(value + digit)
    }
  }

  const handleBackspace = () => {
    onChange(value.slice(0, -1))
  }

  const handleClear = () => {
    onChange("")
  }

  const keypadNumbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["Clear", "0", "⌫"],
  ]

  return (
    <div className="space-y-6">
      {/* Passcode Display */}
      <div className="flex justify-center space-x-3">
        {Array.from({ length: maxLength }).map((_, index) => (
          <motion.div
            key={index}
            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-colors ${
              index < value.length
                ? "border-red-500 bg-red-500/20 text-red-400"
                : "border-gray-600 bg-black/30 text-gray-500"
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {index < value.length ? "●" : ""}
          </motion.div>
        ))}
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {keypadNumbers.flat().map((key, index) => (
          <motion.button
            key={key}
            type="button"
            onClick={() => {
              if (key === "Clear") {
                handleClear()
              } else if (key === "⌫") {
                handleBackspace()
              } else {
                handleKeyPress(key)
              }
            }}
            className={`h-14 rounded-lg font-bold text-lg transition-all duration-200 ${
              key === "Clear" || key === "⌫"
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                : "bg-black/50 hover:bg-red-900/30 text-white border border-gray-600 hover:border-red-500"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {key}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
