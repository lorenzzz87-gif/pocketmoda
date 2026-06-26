import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ChevronRight } from 'lucide-react'
import { Logo } from '../components/ui/Logo'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types'

type Mode = 'login' | 'register'

const ROLE_COLORS: Record<'buyer' | 'seller', string> = {
  buyer:  '#4A3F8F',
  seller: '#3AAFA9',
}

export function LoginPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState<Mode>('login')
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'login') {
      const err = await signIn(email, password)
      if (err) { setError(err); setLoading(false); return }
      // role-based redirect handled by App after profile loads
    } else {
      const err = await signUp(email, password, fullName, role, company, whatsapp)
      if (err) { setError(err); setLoading(false); return }
      setSuccess('注册成功！请检查邮箱确认链接，然后登录。')
      setMode('login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#EBF7F7] rounded-full opacity-60" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#F0EEF8] rounded-full opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-7">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size={56} showWordmark={false} />
          </div>
          <div>
            <p style={{ fontFamily:"'Arial',sans-serif", fontSize:'11px', letterSpacing:'7px', color:'#3AAFA9', textTransform:'uppercase', marginBottom:'2px' }}>pocket</p>
            <h1 style={{ fontFamily:"'Georgia','Palatino',serif", fontSize:'32px', fontWeight:700, color:'#1E2325', letterSpacing:'-0.5px', margin:0, lineHeight:1 }}>Moda</h1>
          </div>
          <p className="text-xs text-silver-600">Italian Fashion · B2B Wholesale Platform</p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded border border-silver-200 overflow-hidden">
          {(['login', 'register'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); setSuccess('') }}
              className="flex-1 py-2 text-sm font-medium transition-colors"
              style={mode === m ? { backgroundColor: '#3AAFA9', color: '#fff' } : { color: '#6B7880' }}
            >
              {m === 'login' ? '登录 Login' : '注册 Register'}
            </button>
          ))}
        </div>

        {success && (
          <div className="bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded border border-emerald-200">
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Register-only fields */}
          {mode === 'register' && (
            <>
              {/* Role selector */}
              <div>
                <label className="text-xs text-silver-600 uppercase tracking-widest block mb-2">
                  我是 / I am
                </label>
                <div className="flex gap-2">
                  {(['buyer', 'seller'] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className="flex-1 py-2.5 text-sm font-medium rounded border transition-all"
                      style={role === r ? {
                        backgroundColor: ROLE_COLORS[r],
                        borderColor: ROLE_COLORS[r],
                        color: '#fff',
                      } : { borderColor: '#D8DCE0', color: '#6B7880' }}
                    >
                      {r === 'buyer' ? '买家 Buyer' : '卖家 Seller'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-silver-600 block mb-1">姓名 Full Name *</label>
                <input
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="王丽华 / Marco Rossini"
                  className="w-full px-3 py-2.5 text-sm border border-silver-200 rounded outline-none focus:border-[#3AAFA9]"
                />
              </div>

              <div>
                <label className="text-xs text-silver-600 block mb-1">公司 Company</label>
                <input
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="Wang Fashion Amsterdam"
                  className="w-full px-3 py-2.5 text-sm border border-silver-200 rounded outline-none focus:border-[#3AAFA9]"
                />
              </div>

              <div>
                <label className="text-xs text-silver-600 block mb-1">
                  WhatsApp 号码（含国际区号）
                </label>
                <input
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="31612345678"
                  className="w-full px-3 py-2.5 text-sm border border-silver-200 rounded outline-none focus:border-[#3AAFA9]"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="text-xs text-silver-600 block mb-1">邮箱 Email *</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 text-sm border border-silver-200 rounded outline-none focus:border-[#3AAFA9]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-silver-600 block mb-1">密码 Password *</label>
            <div className="relative">
              <input
                required
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="最少 6 位"
                minLength={6}
                className="w-full px-3 py-2.5 text-sm border border-silver-200 rounded outline-none focus:border-[#3AAFA9] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-600"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded border border-red-200">
              ⚠️ {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full justify-center"
            style={{ backgroundColor: '#3AAFA9' }}
          >
            {loading ? '处理中…' : mode === 'login' ? '登录' : '注册'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-center text-[10px] text-silver-400">
          PocketModa · 欧洲服装批发平台 · 仅受邀用户
        </p>
      </div>
    </div>
  )
}
