"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Product, Size } from "@/types/product"

// Local cart item type (simpler than database version)
interface LocalCartItem {
  productId: string
  product: Product
  quantity: number
  size: Size
}

interface CartContextType {
  cartItems: LocalCartItem[]
  addToCart: (product: Product, quantity?: number, size?: Size) => void
  removeFromCart: (productId: string, size?: Size) => void
  updateQuantity: (productId: string, quantity: number, size?: Size) => void
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
      const items = JSON.parse(stored)
      // Migration: add default size "M" to old items without size
      return items.map((item: any) => ({
        ...item,
        size: item.size || "M",
      }))
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

// Create a unique key for product+size combo
function itemKey(productId: string, size: Size): string {
  return `${productId}_${size}`
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

  const addToCart = (product: Product, quantity = 1, size: Size = "M") => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.size === size
      )

      if (existingIndex >= 0) {
        // Update quantity of existing item (same product + same size)
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        }
        return updated
      } else {
        // Add new item
        return [...prev, { productId: product.id, product, quantity, size }]
      }
    })
  }

  const removeFromCart = (productId: string, size?: Size) => {
    setCartItems((prev) =>
      prev.filter((item) => {
        if (size) {
          return !(item.productId === productId && item.size === size)
        }
        return item.productId !== productId
      })
    )
  }

  const updateQuantity = (productId: string, quantity: number, size?: Size) => {
    if (quantity <= 0) {
      removeFromCart(productId, size)
      return
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (size) {
          return item.productId === productId && item.size === size
            ? { ...item, quantity }
            : item
        }
        return item.productId === productId ? { ...item, quantity } : item
      })
    )
  }

  const clearCart = () => {
    setCartItems([])
    saveCart([]) // Force save immediately to ensure it's cleared before navigation/unmount
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
