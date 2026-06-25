import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Zap, MessageCircle, Loader2 } from 'lucide-react'
import { useProduct } from '../../hooks/useProducts'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { useOrders } from '../../hooks/useOrders'
import type { OrderItem } from '../../types'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(id ?? '')
  const { placeOrder } = useOrders()

  const [qty, setQty] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [activeImg, setActiveImg] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  if (isLoading) return (
    <div className="flex items-center justify-center py-20 gap-2 text-silver-600">
      <Loader2 className="w-5 h-5 animate-spin" /> 加载中…
    </div>
  )
  if (!product) return <div className="p-8 text-center text-silver-600">商品不存在</div>

  const effectiveQty = qty ?? product.moq
  const applicablePrice = [...product.tier_prices].reverse().find(t => effectiveQty >= t.min_qty)
  const unitPrice = applicablePrice?.price_eur ?? product.tier_prices[0]?.price_eur ?? 0
  const total = unitPrice * effectiveQty

  const handleOrder = async () => {
    setError('')
    setSubmitting(true)
    try {
      const item: OrderItem = {
        product_id: product.id,
        product,
        quantity: effectiveQty,
        unit_price: unitPrice,
        total,
      }
      await placeOrder([item], notes)
      setSubmitted(true)
      setTimeout(() => navigate('/buyer/orders'), 1500)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-silver-600 hover:text-charcoal mb-4">
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
                  className="w-16 h-20 rounded overflow-hidden border-2 transition-colors"
                  style={{ borderColor: activeImg === i ? 'var(--color-primary)' : 'transparent' }}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <p className="text-xs text-silver-600 uppercase tracking-widest">{product.brand}</p>
            <h1 className="text-xl font-semibold text-charcoal mt-1">{product.title}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <div className="flex items-center gap-1 text-xs text-silver-600">
                <MapPin className="w-3 h-3" /> {product.region} · Made in Italy 🇮🇹
              </div>
              <Badge variant="teal">{product.fabric}</Badge>
              {product.is_pronto
                ? <Badge variant="green"><Zap className="w-3 h-3 mr-0.5" />现货 Pronto</Badge>
                : <Badge variant="orange">预购 Pre-Order</Badge>}
            </div>
          </div>

          <p className="text-sm text-silver-600 leading-relaxed">{product.description}</p>

          {/* Tier Pricing */}
          <div>
            <p className="text-xs text-silver-600 uppercase tracking-widest mb-2">阶梯价格 Tier Pricing</p>
            <div className="space-y-1.5">
              {product.tier_prices.map((t, i) => {
                const active = effectiveQty >= t.min_qty && (t.max_qty === null || effectiveQty <= t.max_qty)
                return (
                  <div key={i}
                    className="flex justify-between text-sm px-3 py-1.5 rounded border transition-colors"
                    style={active ? { borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-primary-bg)' } : { borderColor: '#D8DCE0' }}>
                    <span>{t.min_qty}{t.max_qty ? `–${t.max_qty}` : '+'} 件</span>
                    <span style={active ? { color: 'var(--color-primary)', fontWeight: 600 } : {}}>
                      €{t.price_eur}/件
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <p className="text-xs text-silver-600">最小起订量 MOQ: <strong>{product.moq} 件</strong></p>

          {/* Qty */}
          <div>
            <label className="text-xs text-silver-600 uppercase tracking-widest block mb-2">订购数量</label>
            <input
              type="number"
              min={product.moq}
              value={effectiveQty}
              onChange={e => setQty(Math.max(product.moq, Number(e.target.value)))}
              className="w-32 px-3 py-2 text-sm border border-silver-200 rounded outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-sm text-silver-600">总计 Total:</span>
            <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>€{total.toLocaleString()}</span>
            <span className="text-xs text-silver-600">({effectiveQty} × €{unitPrice})</span>
          </div>

          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="备注 / Notes (颜色、尺码要求等)"
            rows={2}
            className="w-full text-sm px-3 py-2 border border-silver-200 rounded outline-none focus:border-[var(--color-primary)] resize-none"
          />

          {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded border border-red-200">⚠️ {error}</p>}

          {submitted ? (
            <div className="bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded border border-emerald-200">
              ✅ 订单已提交！正在跳转到订单页面…
            </div>
          ) : (
            <div className="flex gap-3">
              <Button size="lg" onClick={handleOrder} disabled={submitting} className="flex-1">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : '提交订单 Place Order'}
              </Button>
              {product.seller?.whatsapp && (
                <a
                  href={`https://wa.me/${product.seller.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in "${product.title}" — ${effectiveQty} pcs.`)}`}
                  target="_blank" rel="noopener noreferrer"
                >
                  <Button variant="whatsapp" size="lg">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
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
