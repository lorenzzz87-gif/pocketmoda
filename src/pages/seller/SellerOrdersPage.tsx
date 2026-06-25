import { useState } from 'react'
import { format } from 'date-fns'
import { MessageCircle, ExternalLink, ChevronDown } from 'lucide-react'
import { useOrders } from '../../hooks/useOrders'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ChatPanel } from '../../components/ui/ChatPanel'
import type { OrderStatus } from '../../types'

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:       'confirmed',
  confirmed:     'in_production',
  in_production: 'qc_check',
  qc_check:      'shipped',
  shipped:       'delivered',
}

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending:       '确认订单 Confirm',
  confirmed:     '开始生产 Start Production',
  in_production: 'QC 质检',
  qc_check:      '标记发货 Ship',
  shipped:       '确认到货 Delivered',
}

export function SellerOrdersPage() {
  const { orders, updateStatus } = useOrders()
  const [chatOrderId, setChatOrderId] = useState<string | null>(null)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-charcoal mb-6">订单管理 · Orders</h1>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          {orders.length === 0 && (
            <p className="text-center py-16 text-silver-600">暂无订单</p>
          )}
          {orders.map(order => {
            const nextStatus = NEXT_STATUS[order.status]
            return (
              <div key={order.id} className="bg-white border border-silver-200 rounded p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-mono text-silver-600">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm font-semibold text-charcoal mt-0.5">
                      {order.items[0].product?.title} × {order.items[0].quantity}
                    </p>
                    <p className="text-xs text-silver-600 mt-0.5">
                      {order.buyer?.full_name} · {order.buyer?.company}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="flex items-center gap-3 text-xs text-silver-600">
                  <Badge variant={order.order_type === 'pronto' ? 'green' : 'orange'}>
                    {order.order_type === 'pronto' ? '⚡ Pronto' : '📋 Pre-Order'}
                  </Badge>
                  <span className="font-semibold text-charcoal">€{order.total_eur.toLocaleString()}</span>
                  <span>{format(new Date(order.created_at), 'MM/dd HH:mm')}</span>
                </div>

                {order.notes && (
                  <p className="text-xs text-silver-600 bg-silver-100 rounded px-2 py-1">
                    📝 {order.notes}
                  </p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  {nextStatus && (
                    <Button size="sm" onClick={() => updateStatus(order.id, nextStatus)}>
                      <ChevronDown className="w-3 h-3" />
                      {NEXT_LABEL[order.status]}
                    </Button>
                  )}
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <Button size="sm" variant="danger" onClick={() => updateStatus(order.id, 'cancelled')}>
                      取消
                    </Button>
                  )}
                  <button
                    onClick={() => setChatOrderId(order.id === chatOrderId ? null : order.id)}
                    className="flex items-center gap-1 text-xs px-2 py-1 border border-teal text-teal rounded hover:bg-teal-50"
                  >
                    <MessageCircle className="w-3 h-3" />
                    聊天
                  </button>
                  {order.buyer?.whatsapp && (
                    <a
                      href={`https://wa.me/${order.buyer.whatsapp}?text=${encodeURIComponent(`Hi ${order.buyer.full_name}, regarding your order #${order.id.slice(0, 8).toUpperCase()}:`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs px-2 py-1 bg-[#25D366] text-white rounded hover:bg-[#1ebe5a]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {chatOrderId && (
          <div className="h-[500px] sticky top-20">
            <ChatPanel orderId={chatOrderId} />
          </div>
        )}
      </div>
    </div>
  )
}
