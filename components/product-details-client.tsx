"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Minus, Plus, ShoppingCart, Check } from "lucide-react"
import { OutlawButton as Button } from "@/components/ui/outlaw-button"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/types/product"

interface ProductDetailsClientProps {
  product: Product
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    setIsAdding(true)
    // Add to cart (localStorage - instant)
    addToCart(product, quantity)
    setIsAdding(false)
    setAdded(true)
    // Reset "added" state after 2 seconds
    setTimeout(() => setAdded(false), 2000)
  }

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-red-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900">
            <Image
              src={
                product.image_url || `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(product.name)}`
              }
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-red-400 text-sm font-medium uppercase tracking-wider mb-2">{product.category}</p>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-semibold text-red-400 mb-6">${product.price}</p>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-zinc-300 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Stock Status */}
            <div>
              {product.stock_quantity > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">
                    {product.stock_quantity > 10 ? "In Stock" : `Only ${product.stock_quantity} left!`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-red-400 text-sm">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock_quantity > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock_quantity}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock_quantity === 0}
                  className={`w-full font-semibold py-3 text-lg cursor-pointer ${added ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                >
                  {added ? (
                    <><Check className="w-5 h-5 mr-2" /> Added to Cart!</>
                  ) : isAdding ? (
                    "Adding..."
                  ) : (
                    <><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart - ${(product.price * quantity).toFixed(2)}</>
                  )}
                </Button>
              </div>
            )}

            {/* Product Details */}
            <div className="border-t border-zinc-800 pt-6">
              <h3 className="text-lg font-semibold mb-3">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Category:</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Stock:</span>
                  <span>{product.stock_quantity} available</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Added:</span>
                  <span>{new Date(product.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
