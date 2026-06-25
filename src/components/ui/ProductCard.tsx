import { Zap, MapPin } from 'lucide-react'
import type { Product } from '../../types'
import { Badge } from './Badge'

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const minPrice = Math.min(...product.tier_prices.map(t => t.price_eur))
  const maxPrice = Math.max(...product.tier_prices.map(t => t.price_eur))

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white clip-cut overflow-hidden border border-silver-200 hover:border-teal/40 hover:shadow-md transition-all duration-200"
    >
      {/* Image 3:4 ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-silver-100">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.is_pronto && (
          <div className="absolute top-2 left-2 flex items-center gap-1 text-white text-xs font-semibold px-2 py-0.5 rounded-sm" style={{ backgroundColor: 'var(--color-primary)' }}>
            <Zap className="w-3 h-3" />
            Pronto
          </div>
        )}
        {!product.is_pronto && (
          <div className="absolute top-2 left-2 bg-charcoal/80 text-white text-xs px-2 py-0.5 rounded-sm">
            Pre-Order
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <p className="text-[10px] text-silver-600 uppercase tracking-widest">{product.brand}</p>
        <h3 className="text-sm font-semibold text-charcoal leading-tight line-clamp-2">{product.title}</h3>

        <div className="flex items-center gap-1 text-[10px] text-silver-600">
          <MapPin className="w-3 h-3" />
          {product.region} · Made in Italy
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs text-silver-600">从 </span>
            <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>€{minPrice}</span>
            {maxPrice !== minPrice && (
              <span className="text-xs text-silver-600"> – €{maxPrice}</span>
            )}
          </div>
          <Badge variant="silver">MOQ {product.moq}件</Badge>
        </div>

        <div className="flex gap-1 flex-wrap">
          <Badge variant="teal">{product.fabric}</Badge>
        </div>
      </div>
    </div>
  )
}
