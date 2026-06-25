import { useState } from 'react'
import type { Order, OrderStatus, OrderItem } from '../types'
import { demoOrders, demoBuyer, demoSeller } from '../lib/demo-data'
import { useAuth } from './useAuth'

let ordersStore = [...demoOrders]

export function useOrders() {
  const { user } = useAuth()
  const [, forceRender] = useState(0)
  const refresh = () => forceRender(n => n + 1)

  const myOrders = ordersStore.filter(o =>
    user?.role === 'buyer' ? o.buyer_id === user.id :
    user?.role === 'seller' ? o.seller_id === user.id :
    true
  )

  const placeOrder = (items: OrderItem[], notes: string) => {
    if (!user) return null
    const total = items.reduce((s, i) => s + i.total, 0)
    const isProto = items.every(i => i.product?.is_pronto)
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      buyer_id: user.id,
      buyer: demoBuyer,
      seller_id: items[0].product?.seller_id ?? 'seller-1',
      seller: demoSeller,
      order_type: isProto ? 'pronto' : 'pre_order',
      status: 'pending',
      items,
      notes,
      total_eur: total,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    ordersStore = [newOrder, ...ordersStore]
    refresh()
    return newOrder
  }

  const updateStatus = (orderId: string, status: OrderStatus) => {
    ordersStore = ordersStore.map(o =>
      o.id === orderId ? { ...o, status, updated_at: new Date().toISOString() } : o
    )
    refresh()
  }

  return { orders: myOrders, placeOrder, updateStatus }
}
