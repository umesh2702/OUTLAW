"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import ProductCard from "./product-card"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

type Product = {
    id: string
    name: string
    price: number
    image_url: string
    category: string
    description?: string
}

export default function TShirtGrid() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProducts() {
            const supabase = createClient()
            const { data, error } = await supabase.from("products").select("*").eq("category", "t-shirt")

            if (error) {
                console.error("Error fetching products:", error)
            } else {
                setProducts(data || [])
            }
            setLoading(false)
        }

        fetchProducts()
    }, [])

    return (
        <section className="py-20 px-4 max-w-6xl mx-auto">
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[color:var(--brand-accent)]" />
                </div>
            ) : products.length === 0 ? (
                <p className="text-center text-zinc-500">No t-shirts found in the vault.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ProductCard
                                product={{
                                    ...product,
                                    stock_quantity: 100, // Default for display
                                    created_at: new Date().toISOString(),
                                    updated_at: new Date().toISOString(),
                                    description: product.description || "",
                                }}
                                size="sm"
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    )
}
