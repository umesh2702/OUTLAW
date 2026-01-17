import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/types/product"
import { notFound } from "next/navigation"
import ProductDetailsClient from "@/components/product-details-client"

async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error || !product) {
    return null
  }

  return product
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return <ProductDetailsClient product={product} />
}
