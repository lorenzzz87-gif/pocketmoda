import { useState, useEffect, useRef } from 'react'
import type { Message } from '../types'
import { useAuth } from './useAuth'
import { demoBuyer, demoSeller } from '../lib/demo-data'

const chatStore: Record<string, Message[]> = {
  'ord-001': [
    {
      id: 'm1',
      order_id: 'ord-001',
      sender_id: 'seller-1',
      sender: demoSeller,
      content: 'Ciao! I confirmed your order. We will ship within 3 business days. 🇮🇹',
      created_at: '2024-02-01T11:05:00Z',
    },
    {
      id: 'm2',
      order_id: 'ord-001',
      sender_id: 'buyer-1',
      sender: demoBuyer,
      content: '谢谢！请问可以发DHL吗？',
      created_at: '2024-02-01T11:10:00Z',
    },
    {
      id: 'm3',
      order_id: 'ord-001',
      sender_id: 'seller-1',
      sender: demoSeller,
      content: 'Yes, DHL Express is available. I will send you the tracking number once shipped.',
      created_at: '2024-02-01T11:15:00Z',
    },
  ],
}

export function useChat(orderId: string) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>(chatStore[orderId] ?? [])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages(chatStore[orderId] ?? [])
  }, [orderId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (content: string) => {
    if (!user || !content.trim()) return
    const msg: Message = {
      id: `m-${Date.now()}`,
      order_id: orderId,
      sender_id: user.id,
      sender: user,
      content: content.trim(),
      created_at: new Date().toISOString(),
    }
    if (!chatStore[orderId]) chatStore[orderId] = []
    chatStore[orderId] = [...chatStore[orderId], msg]
    setMessages([...chatStore[orderId]])
  }

  return { messages, sendMessage, bottomRef }
}
