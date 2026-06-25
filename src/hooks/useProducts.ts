import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*, seller:profiles!seller_id(id,full_name,email,whatsapp,company,verified)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as Product[]
    },
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from('products')
        .select('*, seller:profiles!seller_id(id,full_name,email,whatsapp,company,verified)')
        .eq('id', id)
        .single()
      if (error) return null
      return data as Product
    },
    enabled: !!id,
  })
}

export function useSellerProducts(sellerId: string) {
  return useQuery({
    queryKey: ['products', 'seller', sellerId],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as Product[]
    },
    enabled: !!sellerId,
  })
}
