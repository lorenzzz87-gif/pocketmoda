import { useState } from 'react'
import { Zap, MapPin, Plus, Edit2 } from 'lucide-react'
import { demoProducts } from '../../lib/demo-data'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

export function SellerProductsPage() {
  const [products] = useState(demoProducts)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-charcoal">商品管理 · Products</h1>
          <p className="text-sm text-silver-600 mt-0.5">{products.length} 件商品</p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          上架新品
        </Button>
      </div>

      <div className="bg-white border border-silver-200 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-silver-100 text-xs text-silver-600 uppercase tracking-widest">
            <tr>
              <th className="text-left px-4 py-3">商品</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">面料 / 产地</th>
              <th className="text-left px-4 py-3">库存</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">价格</th>
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
                      <p className="font-medium text-charcoal leading-tight">{p.title}</p>
                      <p className="text-xs text-silver-600">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="space-y-1">
                    <Badge variant="teal">{p.fabric}</Badge>
                    <div className="flex items-center gap-1 text-xs text-silver-600">
                      <MapPin className="w-3 h-3" />{p.region}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {p.is_pronto ? (
                    <div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <Zap className="w-3 h-3" /> 现货
                      </div>
                      <p className="text-xs text-silver-600">{p.stock_qty} 件</p>
                    </div>
                  ) : (
                    <span className="text-xs text-orange-600">预购</span>
                  )}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <p className="text-xs">
                    €{Math.min(...p.tier_prices.map(t => t.price_eur))} –{' '}
                    €{Math.max(...p.tier_prices.map(t => t.price_eur))}
                  </p>
                  <p className="text-[10px] text-silver-600">MOQ {p.moq}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-silver-100 text-silver-600'}`}>
                    {p.is_active ? '已上架' : '已下架'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-silver-600 hover:text-teal transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
