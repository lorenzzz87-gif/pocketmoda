export type UserRole = 'buyer' | 'seller' | 'admin'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  whatsapp?: string
  company?: string
  avatar_url?: string
  verified: boolean
  created_at: string
}

export type FabricType = 'Silk' | 'Cashmere' | 'Linen' | 'Cotton' | 'Wool' | 'Denim' | 'Leather'
export type Region = 'Milan' | 'Tuscany' | 'Veneto' | 'Naples' | 'Florence'

export interface TierPrice {
  min_qty: number
  max_qty: number | null
  price_eur: number
}

export interface Product {
  id: string
  seller_id: string
  seller?: User
  title: string
  brand: string
  description: string
  fabric: FabricType
  region: Region
  moq: number
  tier_prices: TierPrice[]
  is_pronto: boolean
  stock_qty: number
  images: string[]
  is_active: boolean
  created_at: string
}

export type OrderType = 'pronto' | 'pre_order'
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_production'
  | 'qc_check'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  product_id: string
  product?: Product
  quantity: number
  unit_price: number
  total: number
}

export interface Order {
  id: string
  buyer_id: string
  buyer?: User
  seller_id: string
  seller?: User
  order_type: OrderType
  status: OrderStatus
  items: OrderItem[]
  notes?: string
  total_eur: number
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  order_id: string
  sender_id: string
  sender?: User
  content: string
  created_at: string
}
