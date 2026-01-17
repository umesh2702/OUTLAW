export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string
  stock_quantity: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  product?: Product
}
