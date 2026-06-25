import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react'
import { useOrders } from '../../hooks/useOrders'
import { demoProducts, demoBuyer, demoSeller } from '../../lib/demo-data'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { format } from 'date-fns'

export function AdminOverviewPage() {
  const { orders } = useOrders()
  const totalGMV = orders.reduce((s, o) => s + o.total_eur, 0)

  const stats = [
    { label: '注册用户', en: 'Users', value: 2, icon: Users, color: 'text-blue-500' },
    { label: '商品总数', en: 'Products', value: demoProducts.length, icon: Package, color: 'text-teal' },
    { label: '订单总数', en: 'Orders', value: orders.length, icon: ShoppingCart, color: 'text-orange-500' },
    { label: '总 GMV', en: 'Total GMV', value: `€${totalGMV.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-charcoal">管理员总览 · Admin Overview</h1>
        <p className="text-sm text-silver-600 mt-0.5">PocketModa 平台数据</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-silver-200 rounded p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-silver-600">{s.label}</p>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-charcoal">{s.value}</p>
            <p className="text-[10px] text-silver-400">{s.en}</p>
          </div>
        ))}
      </div>

      {/* All orders */}
      <div>
        <h2 className="text-sm font-semibold text-silver-600 uppercase tracking-widest mb-3">全部订单</h2>
        <div className="bg-white border border-silver-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-silver-100 text-xs text-silver-600 uppercase tracking-widest">
              <tr>
                <th className="text-left px-4 py-3">订单号</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">买家</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">商品</th>
                <th className="text-left px-4 py-3">金额</th>
                <th className="text-left px-4 py-3">状态</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">日期</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-silver-100">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-silver-100/40">
                  <td className="px-4 py-3 font-mono text-xs text-silver-600">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-xs font-medium">{o.buyer?.full_name}</p>
                    <p className="text-[10px] text-silver-600">{o.buyer?.company}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs">{o.items[0].product?.title} × {o.items[0].quantity}</td>
                  <td className="px-4 py-3 text-sm font-semibold">€{o.total_eur.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 hidden sm:table-cell text-xs text-silver-600">
                    {format(new Date(o.created_at), 'MM/dd/yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
