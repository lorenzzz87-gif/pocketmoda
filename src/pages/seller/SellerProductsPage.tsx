import { Zap, MapPin, Plus, Edit2 } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useSellerProducts } from '../../hooks/useProducts'
import { useAuth } from '../../hooks/useAuth'

export function SellerProductsPage() {
  const { user } = useAuth()
  const { data: products = [] } = useSellerProducts(user?.id ?? '')

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold text-charcoal">商品管理</h1>
          <p className="text-sm text-silver-600">{products.length} 件商品</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4" />
          上架新品
        </Button>
      </div>

      {/* Mobile: card list */}
      <div className="space-y-3 md:hidden">
        {products.map(p => (
          <div key={p.id} className="bg-white border border-silver-200 rounded p-3 flex gap-3">
            <img src={p.images[0]} alt="" className="w-14 h-18 object-cover rounded flex-shrink-0" style={{ height: 72 }} />
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-sm font-semibold text-charcoal truncate">{p.title}</p>
              <p className="text-xs text-silver-600">{p.brand}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="teal">{p.fabric}</Badge>
                {p.is_pronto
                  ? <span className="flex items-center gap-0.5 text-xs text-emerald-600"><Zap className="w-3 h-3" />现货</span>
                  : <span className="text-xs text-orange-500">预购</span>}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${p.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-silver-100 text-silver-600'}`}>
                  {p.is_active ? '上架' : '下架'}
                </span>
              </div>
              <p className="text-xs text-charcoal font-medium">
                €{Math.min(...p.tier_prices.map(t => t.price_eur))} – €{Math.max(...p.tier_prices.map(t => t.price_eur))}
                <span className="text-silver-400 ml-1">MOQ {p.moq}</span>
              </p>
            </div>
            <button className="text-silver-400 hover:text-charcoal self-start">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-white border border-silver-200 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-silver-100 text-xs text-silver-600 uppercase tracking-widest">
            <tr>
              <th className="text-left px-4 py-3">商品</th>
              <th className="text-left px-4 py-3">面料 / 产地</th>
              <th className="text-left px-4 py-3">库存</th>
              <th className="text-left px-4 py-3">价格</th>
              <th className="text-left px-4 py-3">状态</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silver-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-silver-100/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="w-10 h-12 object-cover rounded" />
                    <div>
                      <p className="font-medium text-charcoal">{p.title}</p>
                      <p className="text-xs text-silver-600">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="teal">{p.fabric}</Badge>
                  <div className="flex items-center gap-1 text-xs text-silver-600 mt-1">
                    <MapPin className="w-3 h-3" />{p.region}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {p.is_pronto
                    ? <><div className="flex items-center gap-1 text-xs font-semibold text-emerald-600"><Zap className="w-3 h-3" />现货</div><p className="text-xs text-silver-600">{p.stock_qty} 件</p></>
                    : <span className="text-xs text-orange-600">预购</span>}
                </td>
                <td className="px-4 py-3 text-xs">
                  €{Math.min(...p.tier_prices.map(t => t.price_eur))} – €{Math.max(...p.tier_prices.map(t => t.price_eur))}
                  <p className="text-[10px] text-silver-600">MOQ {p.moq}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-silver-100 text-silver-600'}`}>
                    {p.is_active ? '已上架' : '已下架'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-silver-600 hover:text-charcoal"><Edit2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
