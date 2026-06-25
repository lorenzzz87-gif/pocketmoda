import { Package, ShoppingCart, CheckCircle, Clock } from 'lucide-react'
import { useOrders } from '../../hooks/useOrders'
import { demoProducts } from '../../lib/demo-data'

export function SellerDashboard() {
  const { orders } = useOrders()

  const stats = [
    { label: '活跃商品', label_en: 'Active Products', value: demoProducts.filter(p => p.is_active).length, icon: Package, color: 'text-teal' },
    { label: '总订单', label_en: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-blue-500' },
    { label: '待处理', label_en: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: 'text-orange-500' },
    { label: '已完成', label_en: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle, color: 'text-emerald-500' },
  ]

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-charcoal">控制台 · Dashboard</h1>
        <p className="text-sm text-silver-600 mt-0.5">Buongiorno! 今日概览</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-silver-200 rounded p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-silver-600">{s.label}</p>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-charcoal">{s.value}</p>
            <p className="text-[10px] text-silver-400">{s.label_en}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="text-sm font-semibold text-charcoal mb-3 uppercase tracking-widest text-silver-600">最新订单</h2>
        <div className="bg-white border border-silver-200 rounded divide-y divide-silver-100">
          {recentOrders.length === 0 && (
            <p className="text-center py-8 text-sm text-silver-600">暂无订单</p>
          )}
          {recentOrders.map(o => (
            <div key={o.id} className="px-4 py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-silver-600">#{o.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-sm text-charcoal">{o.items[0].product?.title} × {o.items[0].quantity}</p>
                <p className="text-xs text-silver-600">{o.buyer?.full_name} · {o.buyer?.company}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-charcoal">€{o.total_eur.toLocaleString()}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  o.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                  o.status === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                  o.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-silver-100 text-silver-600'
                }`}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
