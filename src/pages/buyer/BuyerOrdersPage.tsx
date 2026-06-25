import { useState } from 'react'
import { format } from 'date-fns'
import { MessageCircle, ExternalLink } from 'lucide-react'
import { useOrders } from '../../hooks/useOrders'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Badge } from '../../components/ui/Badge'
import { ChatPanel } from '../../components/ui/ChatPanel'
import { buildOrderWhatsApp } from '../../lib/whatsapp'

export function BuyerOrdersPage() {
  const { orders } = useOrders()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-charcoal mb-6">我的订单 · My Orders</h1>

      {orders.length === 0 && (
        <div className="text-center py-16 text-silver-600">
          <p>暂无订单 · No orders yet</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Order list */}
        <div className="space-y-3">
          {orders.map(order => (
            <div
              key={order.id}
              onClick={() => setSelectedOrderId(order.id === selectedOrderId ? null : order.id)}
              className={`border rounded p-4 cursor-pointer transition-all hover:border-teal/40 ${
                selectedOrderId === order.id ? 'border-teal bg-teal-50' : 'border-silver-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-xs text-silver-600 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm font-semibold text-charcoal mt-0.5">
                    {order.items[0].product?.title}
                    {order.items.length > 1 && ` +${order.items.length - 1}`}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="flex items-center gap-3 text-xs text-silver-600 flex-wrap">
                <Badge variant={order.order_type === 'pronto' ? 'green' : 'orange'}>
                  {order.order_type === 'pronto' ? '⚡ Pronto' : '📋 Pre-Order'}
                </Badge>
                <span>{order.items[0].quantity} 件</span>
                <span className="font-semibold text-charcoal">€{order.total_eur.toLocaleString()}</span>
                <span>{format(new Date(order.created_at), 'MM/dd HH:mm')}</span>
              </div>

              {/* WhatsApp button */}
              {order.seller?.whatsapp && (
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={buildOrderWhatsApp(order.seller.whatsapp, order.id, order.items[0].product?.title ?? '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-xs px-2 py-1 bg-[#25D366] text-white rounded hover:bg-[#1ebe5a] transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    WhatsApp 联系卖家
                  </a>
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedOrderId(order.id === selectedOrderId ? null : order.id) }}
                    className="flex items-center gap-1.5 text-xs px-2 py-1 border border-teal text-teal rounded hover:bg-teal-50 transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" />
                    站内聊天
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat panel */}
        {selectedOrderId && (
          <div className="h-[500px] sticky top-20">
            <ChatPanel orderId={selectedOrderId} />
          </div>
        )}
      </div>
    </div>
  )
}
