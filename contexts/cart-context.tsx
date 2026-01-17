"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Product } from "@/types/product"

// Local cart item type (simpler than database version)
interface LocalCartItem {
  productId: string
  product: Product
  quantity: number
}

interface CartContextType {
  cartItems: LocalCartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
  loading: boolean
}

const CART_STORAGE_KEY = "outlaw_cart"

const CartContext = createContext<CartContextType | undefined>(undefined)

// Helper to get cart from localStorage
function getStoredCart(): LocalCartItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parsing errors
  }
  return []
}

// Helper to save cart to localStorage
function saveCart(items: LocalCartItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore storage errors
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<LocalCartItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = getStoredCart()
    setCartItems(stored)
    setLoading(false)
  }, [])

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (!loading) {
      saveCart(cartItems)
    }
  }, [cartItems, loading])

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === product.id)

      if (existingIndex >= 0) {
        // Update quantity of existing item
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        }
        return updated
      } else {
        // Add new item
        return [...prev, { productId: product.id, product, quantity }]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
