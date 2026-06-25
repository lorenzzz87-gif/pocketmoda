import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Zap, MessageCircle } from 'lucide-react'
import { demoProducts } from '../../lib/demo-data'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { useOrders } from '../../hooks/useOrders'
import type { OrderItem } from '../../types'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { placeOrder } = useOrders()
  const product = demoProducts.find(p => p.id === id)

  const [qty, setQty] = useState(product?.moq ?? 1)
  const [notes, setNotes] = useState('')
  const [activeImg, setActiveImg] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  if (!product) return <div className="p-8 text-center text-silver-600">商品不存在</div>

  const applicablePrice = [...product.tier_prices]
    .reverse()
    .find(t => qty >= t.min_qty)
  const unitPrice = applicablePrice?.price_eur ?? product.tier_prices[0].price_eur
  const total = unitPrice * qty

  const handleOrder = () => {
    const item: OrderItem = {
      product_id: product.id,
      product,
      quantity: qty,
      unit_price: unitPrice,
      total,
    }
    const order = placeOrder([item], notes)
    if (order) {
      setSubmitted(true)
      setTimeout(() => navigate('/buyer/orders'), 1500)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-silver-600 hover:text-teal mb-4">
        <ArrowLeft className="w-4 h-4" /> 返回展厅
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-[3/4] overflow-hidden rounded bg-silver-100">
            <img src={product.images[activeImg]} alt={product.title} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-20 rounded overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-teal' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info + Order */}
        <div className="space-y-5">
          <div>
            <p className="text-xs text-silver-600 uppercase tracking-widest">{product.brand}</p>
            <h1 className="text-xl font-semibold text-charcoal mt-1">{product.title}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <div className="flex items-center gap-1 text-xs text-silver-600">
                <MapPin className="w-3 h-3" /> {product.region} · Made in Italy 🇮🇹
              </div>
              <Badge variant="teal">{product.fabric}</Badge>
              {product.is_pronto ? (
                <Badge variant="green"><Zap className="w-3 h-3 mr-0.5" />现货 Pronto</Badge>
              ) : (
                <Badge variant="orange">预购 Pre-Order</Badge>
              )}
            </div>
          </div>

          <p className="text-sm text-silver-600 leading-relaxed">{product.description}</p>

          {/* Tier Pricing */}
          <div>
            <p className="text-xs text-silver-600 uppercase tracking-widest mb-2">阶梯价格 Tier Pricing</p>
            <div className="space-y-1.5">
              {product.tier_prices.map((t, i) => {
                const active = qty >= t.min_qty && (t.max_qty === null || qty <= t.max_qty)
                return (
                  <div key={i} className={`flex justify-between text-sm px-3 py-1.5 rounded border ${
                    active ? 'border-teal bg-teal-50 font-semibold' : 'border-silver-200'
                  }`}>
                    <span>{t.min_qty}{t.max_qty ? `–${t.max_qty}` : '+'} 件</span>
                    <span className={active ? 'text-teal' : ''}>€{t.price_eur}/件</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="text-xs text-silver-600">最小起订量 MOQ: <strong>{product.moq} 件</strong></div>

          {/* Qty Input */}
          <div>
            <label className="text-xs text-silver-600 uppercase tracking-widest block mb-2">订购数量</label>
            <input
              type="number"
              min={product.moq}
              value={qty}
              onChange={e => setQty(Math.max(product.moq, Number(e.target.value)))}
              className="w-32 px-3 py-2 text-sm border border-silver-200 rounded outline-none focus:border-teal"
            />
          </div>

          {/* Total */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-silver-600">总计 Total:</span>
            <span className="text-2xl font-bold text-teal">€{total.toLocaleString()}</span>
            <span className="text-xs text-silver-600">({qty} × €{unitPrice})</span>
          </div>

          {/* Notes */}
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="备注 / Notes (颜色、尺码要求等)"
            rows={2}
            className="w-full text-sm px-3 py-2 border border-silver-200 rounded outline-none focus:border-teal resize-none"
          />

          {/* Actions */}
          {submitted ? (
            <div className="bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded border border-emerald-200">
              ✅ 订单已提交！正在跳转到订单页面…
            </div>
          ) : (
            <div className="flex gap-3">
              <Button size="lg" onClick={handleOrder} className="flex-1">
                提交订单 Place Order
              </Button>
              {product.seller?.whatsapp && (
                <a
                  href={`https://wa.me/${product.seller.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in "${product.title}" — ${qty} pcs.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="whatsapp" size="lg">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
