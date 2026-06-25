import { CheckCircle, XCircle, Building2, Phone } from 'lucide-react'
import { demoBuyer, demoSeller } from '../../lib/demo-data'
import type { User } from '../../types'
import { Badge } from '../../components/ui/Badge'

const allUsers: User[] = [demoBuyer, demoSeller]

export function AdminUsersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-charcoal">用户管理 · Users</h1>
        <Badge variant="silver">{allUsers.length} 用户</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {allUsers.map(user => (
          <div key={user.id} className="bg-white border border-silver-200 rounded p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-charcoal">{user.full_name}</p>
                <p className="text-sm text-silver-600">{user.email}</p>
              </div>
              <Badge variant={user.role === 'buyer' ? 'blue' : 'teal'}>
                {user.role === 'buyer' ? '买家 Buyer' : '卖家 Seller'}
              </Badge>
            </div>

            {user.company && (
              <div className="flex items-center gap-2 text-sm text-silver-600">
                <Building2 className="w-4 h-4" />
                {user.company}
              </div>
            )}

            {user.whatsapp && (
              <div className="flex items-center gap-2 text-sm text-silver-600">
                <Phone className="w-4 h-4" />
                +{user.whatsapp}
              </div>
            )}

            <div className="flex items-center gap-2">
              {user.verified ? (
                <span className="flex items-center gap-1 text-xs text-emerald-600">
                  <CheckCircle className="w-3.5 h-3.5" /> 已认证
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-orange-600">
                  <XCircle className="w-3.5 h-3.5" /> 待认证
                </span>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              {!user.verified && (
                <button className="text-xs px-3 py-1.5 bg-teal text-white rounded hover:bg-teal-600 transition-colors">
                  通过认证
                </button>
              )}
              <button className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors">
                封禁账号
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
