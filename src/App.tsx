import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { Navbar } from './components/layout/Navbar'
import { LoginPage } from './pages/LoginPage'

import { ShowroomPage } from './pages/buyer/ShowroomPage'
import { ProductDetailPage } from './pages/buyer/ProductDetailPage'
import { BuyerOrdersPage } from './pages/buyer/BuyerOrdersPage'

import { SellerDashboard } from './pages/seller/SellerDashboard'
import { SellerProductsPage } from './pages/seller/SellerProductsPage'
import { SellerOrdersPage } from './pages/seller/SellerOrdersPage'

import { AdminOverviewPage } from './pages/admin/AdminOverviewPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 mx-auto border-2 border-silver-200 rounded-full animate-spin" style={{ borderTopColor: 'var(--color-primary)' }} />
          <p className="text-sm text-silver-600">Loading…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <main>
        <Routes>
          {user.role === 'buyer' && (
            <>
              <Route path="/buyer" element={<ShowroomPage />} />
              <Route path="/buyer/product/:id" element={<ProductDetailPage />} />
              <Route path="/buyer/orders" element={<BuyerOrdersPage />} />
              <Route path="*" element={<Navigate to="/buyer" replace />} />
            </>
          )}
          {user.role === 'seller' && (
            <>
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/seller/products" element={<SellerProductsPage />} />
              <Route path="/seller/orders" element={<SellerOrdersPage />} />
              <Route path="*" element={<Navigate to="/seller" replace />} />
            </>
          )}
          {user.role === 'admin' && (
            <>
              <Route path="/admin" element={<AdminOverviewPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/orders" element={<AdminOverviewPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/pocketmoda">
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
