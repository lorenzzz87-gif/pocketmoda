import { useState } from 'react'
import { Send, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import { useChat } from '../../hooks/useChat'
import { useAuth } from '../../hooks/useAuth'

export function ChatPanel({ orderId }: { orderId: string }) {
  const { messages, sendMessage, bottomRef } = useChat(orderId)
  const { user } = useAuth()
  const [text, setText] = useState('')

  const handleSend = () => {
    sendMessage(text)
    setText('')
  }

  return (
    <div className="flex flex-col h-full border border-silver-200 rounded bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-silver-200" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
        <MessageCircle className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>订单对话 · Order Chat</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-scroll p-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <p className="text-center text-sm text-silver-600 py-8">
            暂无消息 · No messages yet
          </p>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_id === user?.id
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${isMe ? 'text-white' : 'bg-silver-100 text-charcoal'}`}
                style={isMe ? { backgroundColor: 'var(--color-primary)' } : {}}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-silver-600 mt-0.5 px-1">
                {msg.sender?.full_name} · {format(new Date(msg.created_at), 'HH:mm')}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-2 border-t border-silver-200 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="输入消息 · Type a message..."
          className="flex-1 text-sm px-3 py-2 border border-silver-200 rounded outline-none focus:border-[var(--color-primary)]"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="p-2 text-white rounded disabled:opacity-40 transition-all hover:opacity-80"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
