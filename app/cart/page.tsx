"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { OutlawButton } from "@/components/ui/outlaw-button"
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react"

export default function CartPage() {
  const { cartItems, cartTotal, loading, updateQuantity, removeFromCart, clearCart } = useCart()

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>
          <div className="space-y-4">
            <div className="h-24 w-full animate-pulse rounded-xl bg-zinc-900" />
            <div className="h-24 w-full animate-pulse rounded-xl bg-zinc-900" />
          </div>
        </div>
      </main>
    )
  }

  if (!cartItems.length) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-zinc-800/50 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-zinc-600" />
          </div>
          <h1 className="mb-4 text-3xl font-bold">Your Cart is Empty</h1>
          <p className="mb-8 text-zinc-400 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Discover something from the vault.
          </p>
          <OutlawButton href="/catalog" className="cursor-pointer">
            Browse Catalog
          </OutlawButton>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-red-400 mb-2 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold">Your Cart</h1>
            <p className="text-zinc-400">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-colors"
            >
              {/* Image */}
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                <Image
                  src={item.product?.image_url || "/images/outlaw-tee-skull-graphic.png"}
                  alt={item.product?.name || "Product"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-zinc-100 truncate">{item.product?.name}</h3>
                <p className="text-sm text-zinc-400 capitalize">{item.product?.category}</p>
                <p className="text-lg font-bold text-red-400 mt-1">${item.product?.price}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Subtotal & Remove */}
              <div className="text-right">
                <p className="font-semibold text-zinc-100">
                  ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                </p>
                <button
                  aria-label="Remove item"
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-400 hover:text-red-300 transition-colors mt-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-400">Subtotal</span>
            <span className="font-semibold">${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-400">Shipping</span>
            <span className="text-green-400 font-medium">Free</span>
          </div>
          <div className="border-t border-zinc-800 pt-4 flex items-center justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-red-400">${cartTotal.toFixed(2)}</span>
          </div>
          <OutlawButton href="#" className="w-full mt-6 cursor-pointer">
            Proceed to Checkout
          </OutlawButton>
          <p className="text-xs text-zinc-500 text-center mt-4">
            Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </main>
  )
}
