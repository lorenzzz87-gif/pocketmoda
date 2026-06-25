import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Order, OrderStatus, OrderItem } from '../types'
import { useAuth } from './useAuth'

export function useOrders() {
  const { user } = useAuth()
  const qc = useQueryClient()

  const ordersQuery = useQuery({
    queryKey: ['orders', user?.id, user?.role],
    enabled: !!user,
    queryFn: async (): Promise<Order[]> => {
      let q = supabase
        .from('orders')
        .select(`
          *,
          buyer:profiles!buyer_id(id,full_name,email,whatsapp,company),
          seller:profiles!seller_id(id,full_name,email,whatsapp,company),
          items:order_items(*, product:products(id,title,brand,images,is_pronto,tier_prices,moq))
        `)
        .order('created_at', { ascending: false })

      if (user?.role === 'buyer')  q = q.eq('buyer_id', user.id)
      if (user?.role === 'seller') q = q.eq('seller_id', user.id)

      const { data, error } = await q
      if (error) throw error
      return (data ?? []) as unknown as Order[]
    },
  })

  const placeMutation = useMutation({
    mutationFn: async ({ items, notes }: { items: OrderItem[]; notes: string }) => {
      if (!user) throw new Error('Not logged in')
      const sellerId = items[0].product?.seller_id
      if (!sellerId) throw new Error('No seller on product')

      const isProto = items.every(i => i.product?.is_pronto)
      const total = items.reduce((s, i) => s + i.total, 0)

      const { data: order, error: oErr } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          seller_id: sellerId,
          order_type: isProto ? 'pronto' : 'pre_order',
          status: 'pending',
          notes: notes || null,
          total_eur: total,
        })
        .select()
        .single()
      if (oErr) throw oErr

      const { error: iErr } = await supabase.from('order_items').insert(
        items.map(i => ({
          order_id: order.id,
          product_id: i.product_id,
          quantity: i.quantity,
          unit_price: i.unit_price,
          total: i.total,
        }))
      )
      if (iErr) throw iErr
      return order
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })

  const statusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })

  return {
    orders: ordersQuery.data ?? [],
    loading: ordersQuery.isLoading,
    placeOrder: (items: OrderItem[], notes: string) =>
      placeMutation.mutateAsync({ items, notes }),
    updateStatus: (orderId: string, status: OrderStatus) =>
      statusMutation.mutateAsync({ orderId, status }),
  }
}
