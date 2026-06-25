import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import { ProductCard } from '../../components/ui/ProductCard'
import type { FabricType, Region } from '../../types'

const FABRICS: FabricType[] = ['Silk', 'Cashmere', 'Linen', 'Cotton', 'Wool', 'Denim', 'Leather']
const REGIONS: Region[] = ['Milan', 'Tuscany', 'Veneto', 'Naples', 'Florence']

export function ShowroomPage() {
  const navigate = useNavigate()
  const { data: products = [], isLoading } = useProducts()

  const [search, setSearch] = useState('')
  const [selectedFabrics, setSelectedFabrics] = useState<FabricType[]>([])
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([])
  const [prontoOnly, setProntoOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const toggleFabric = (f: FabricType) =>
    setSelectedFabrics(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  const toggleRegion = (r: Region) =>
    setSelectedRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedFabrics.length && !selectedFabrics.includes(p.fabric)) return false
      if (selectedRegions.length && !selectedRegions.includes(p.region)) return false
      if (prontoOnly && !p.is_pronto) return false
      return p.is_active
    })
  }, [products, search, selectedFabrics, selectedRegions, prontoOnly])

  const hasFilters = selectedFabrics.length > 0 || selectedRegions.length > 0 || prontoOnly

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-charcoal">Digital Showroom · 数字展厅</h1>
        <p className="text-sm text-silver-600 mt-0.5">Italian wholesale collections · 意大利批发精选</p>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-600" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索商品、品牌... Search products"
            className="w-full pl-9 pr-3 py-2 text-sm border border-silver-200 rounded outline-none focus:border-[var(--color-primary)]"
          />
        </div>
        <button
          onClick={() => setShowFilters(v => !v)}
          className="flex items-center gap-2 px-3 py-2 text-sm border rounded transition-colors"
          style={hasFilters
            ? { borderColor: 'var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-bg)' }
            : { borderColor: '#D8DCE0', color: '#1E2325' }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          筛选{hasFilters ? ` (${selectedFabrics.length + selectedRegions.length + (prontoOnly ? 1 : 0)})` : ''}
        </button>
      </div>

      {showFilters && (
        <div className="mb-5 p-4 border border-silver-200 rounded bg-white space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-charcoal">筛选条件</span>
            {hasFilters && (
              <button onClick={() => { setSelectedFabrics([]); setSelectedRegions([]); setProntoOnly(false) }}
                className="text-xs flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                <X className="w-3 h-3" /> 清除
              </button>
            )}
          </div>
          <div>
            <p className="text-xs text-silver-600 uppercase tracking-widest mb-2">面料 Fabric</p>
            <div className="flex flex-wrap gap-2">
              {FABRICS.map(f => (
                <button key={f} onClick={() => toggleFabric(f)}
                  className="px-3 py-1 text-xs rounded border transition-colors"
                  style={selectedFabrics.includes(f)
                    ? { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: '#fff' }
                    : { borderColor: '#D8DCE0' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-silver-600 uppercase tracking-widest mb-2">产地 Region</p>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map(r => (
                <button key={r} onClick={() => toggleRegion(r)}
                  className="px-3 py-1 text-xs rounded border transition-colors"
                  style={selectedRegions.includes(r)
                    ? { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: '#fff' }
                    : { borderColor: '#D8DCE0' }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={prontoOnly} onChange={e => setProntoOnly(e.target.checked)} className="accent-[var(--color-primary)]" />
            <span className="text-sm text-charcoal">⚡ 只看现货 Pronto only</span>
          </label>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-silver-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">加载商品中…</span>
        </div>
      ) : (
        <>
          <p className="text-xs text-silver-600 mb-4">{filtered.length} 件商品</p>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-silver-600">
              <p className="text-lg">😔 没有找到符合条件的商品</p>
              <p className="text-sm mt-1">No products match your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onClick={() => navigate(`/buyer/product/${p.id}`)} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
