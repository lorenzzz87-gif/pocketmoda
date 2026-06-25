import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Store, Shield } from 'lucide-react'
import { Logo } from '../components/ui/Logo'
import { useAuth } from '../hooks/useAuth'
import { THEMES } from '../lib/theme'
import type { UserRole } from '../types'

const ROLES: { role: UserRole; label: string; label_zh: string; desc: string; icon: typeof ShoppingBag }[] = [
  {
    role: 'buyer',
    label: 'Buyer',
    label_zh: '买家',
    desc: '浏览展厅、下单、追踪订单',
    icon: ShoppingBag,
  },
  {
    role: 'seller',
    label: 'Seller',
    label_zh: '卖家',
    desc: '上架商品、管理库存、接单',
    icon: Store,
  },
  {
    role: 'admin',
    label: 'Admin',
    label_zh: '管理员',
    desc: '平台管理、用户审核、全局数据',
    icon: Shield,
  },
]

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (role: UserRole) => {
    login(role)
    navigate(`/${role}`)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-50 rounded-full opacity-60" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-silver-100 rounded-full opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Logo + headline */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size={48} showWordmark={false} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-charcoal tracking-tight">PocketModa</h1>
            <p className="text-sm text-silver-600 mt-1">Italian Fashion · B2B Wholesale Platform</p>
            <p className="text-xs text-silver-400 mt-0.5">欧洲服装批发平台</p>
          </div>
        </div>

        {/* Demo login cards */}
        <div className="space-y-3">
          <p className="text-xs text-center text-silver-600 uppercase tracking-widest">选择身份进入 Demo</p>
          {ROLES.map(({ role, label, label_zh, desc, icon: Icon }) => {
            const t = THEMES[role]
            return (
              <button
                key={role}
                onClick={() => handleLogin(role)}
                className="w-full flex items-center gap-4 p-4 border rounded transition-all group text-left hover:shadow-md"
                style={{ borderColor: '#E2E8F0' }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = t.primary
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = t.primaryBg
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = ''
                }}
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
                  style={{ backgroundColor: t.primary }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-charcoal">
                    {label} · {label_zh}
                  </p>
                  <p className="text-xs text-silver-600">{desc}</p>
                </div>
                {/* Color swatch */}
                <div className="w-3 h-8 rounded-full opacity-40" style={{ backgroundColor: t.primary }} />
              </button>
            )
          })}
        </div>

        <p className="text-center text-[10px] text-silver-400">
          Demo 模式 · 数据仅在本次会话中保存
        </p>
      </div>
    </div>
  )
}
