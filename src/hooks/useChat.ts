import { useState, useEffect, useRef } from 'react'
import type { Message } from '../types'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useChat(orderId: string) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  // 初始加载历史消息
  useEffect(() => {
    if (!orderId) return

    supabase
      .from('messages')
      .select('*, sender:profiles!sender_id(id,full_name,avatar_url)')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data as unknown as Message[])
      })

    // Supabase Realtime 订阅
    const channel = supabase
      .channel(`messages:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `order_id=eq.${orderId}`,
        },
        async (payload) => {
          // 获取 sender 信息
          const { data: sender } = await supabase
            .from('profiles')
            .select('id,full_name,avatar_url')
            .eq('id', payload.new.sender_id)
            .single()
          const msg = { ...payload.new, sender } as unknown as Message
          setMessages(prev => [...prev, msg])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [orderId])

  // 自动滚到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!user || !content.trim() || !orderId) return
    await supabase.from('messages').insert({
      order_id: orderId,
      sender_id: user.id,
      content: content.trim(),
    })
  }

  return { messages, sendMessage, bottomRef }
}
