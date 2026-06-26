import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react'
import { useOrders } from '../../hooks/useOrders'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { format } from 'date-fns'

export function AdminOverviewPage() {
  const { orders } = useOrders()
  const totalGMV = orders.reduce((s, o) => s + o.total_eur, 0)

  const stats = [
    { label: '注册用户', en: 'Users', value: 2, icon: Users, color: 'text-blue-500' },
    { label: '商品总数', en: 'Products', value: 6, icon: Package, color: 'text-teal' },
    { label: '订单总数', en: 'Orders', value: orders.length, icon: ShoppingCart, color: 'text-orange-500' },
    { label: '总 GMV', en: 'Total GMV', value: `€${totalGMV.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-charcoal">管理员总览</h1>
        <p className="text-sm text-silver-600 mt-0.5">PocketModa 平台数据</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-silver-200 rounded p-3 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-silver-600">{s.label}</p>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-charcoal">{s.value}</p>
            <p className="text-[10px] text-silver-400">{s.en}</p>
          </div>
        ))}
      </div>

      {/* Orders — card layout on mobile */}
      <div>
        <h2 className="text-xs font-semibold text-silver-600 uppercase tracking-widest mb-3">全部订单</h2>

        {orders.length === 0 ? (
          <p className="text-center py-10 text-sm text-silver-600">暂无订单</p>
        ) : (
          <div className="space-y-2">
            {orders.map(o => (
              <div key={o.id} className="bg-white border border-silver-200 rounded p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-silver-500">#{o.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm font-medium text-charcoal truncate mt-0.5">
                      {o.buyer?.full_name}
                      {o.buyer?.company ? ` · ${o.buyer.company}` : ''}
                    </p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-silver-600">
                    {format(new Date(o.created_at), 'MM/dd HH:mm')}
                  </p>
                  <p className="text-sm font-bold text-charcoal">€{o.total_eur.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
