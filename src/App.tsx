import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { Navbar } from './components/layout/Navbar'
import { LoginPage } from './pages/LoginPage'

// Buyer
import { ShowroomPage } from './pages/buyer/ShowroomPage'
import { ProductDetailPage } from './pages/buyer/ProductDetailPage'
import { BuyerOrdersPage } from './pages/buyer/BuyerOrdersPage'

// Seller
import { SellerDashboard } from './pages/seller/SellerDashboard'
import { SellerProductsPage } from './pages/seller/SellerProductsPage'
import { SellerOrdersPage } from './pages/seller/SellerOrdersPage'

// Admin
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'

function ProtectedRoutes() {
  const { user, loading } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center text-silver-600">Loading…</div>
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <main>
        <Routes>
          {/* Buyer */}
          <Route path="/buyer" element={<ShowroomPage />} />
          <Route path="/buyer/product/:id" element={<ProductDetailPage />} />
          <Route path="/buyer/orders" element={<BuyerOrdersPage />} />

          {/* Seller */}
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/products" element={<SellerProductsPage />} />
          <Route path="/seller/orders" element={<SellerOrdersPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminOverviewPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/orders" element={<AdminOverviewPage />} />

          {/* Fallback to role home */}
          <Route path="*" element={<Navigate to={`/${user.role}`} replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginLoginWrapper />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

function LoginLoginWrapper() {
  const { user } = useAuth()
  if (user) return <Navigate to={`/${user.role}`} replace />
  return <LoginPage />
}
