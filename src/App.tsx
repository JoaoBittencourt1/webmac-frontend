import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { MainLayout } from './components/layout/MainLayout'
import { AuthProvider } from './context/AuthContext'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { HomePage } from './pages/HomePage'
import { LoginPage, MechanicLoginPage } from './pages/LoginPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProfilePage } from './pages/ProfilePage'
import { SignUpPage } from './pages/SignUpPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route path="entrar" element={<LoginPage />} />
            <Route path="entrar/mecanico" element={<MechanicLoginPage />} />
            <Route path="esqueci-senha" element={<ForgotPasswordPage />} />
            <Route path="cadastro" element={<SignUpPage />} />
            <Route path="saq" element={<PlaceholderPage title="SAQ" />} />
            <Route
              path="parceiro"
              element={<PlaceholderPage title="SEJA UM PARCEIRO" />}
            />
            <Route
              path="pedidos"
              element={
                <ProtectedRoute allowedRoles={['CLIENTE']}>
                  <PlaceholderPage title="MEUS PEDIDOS" />
                </ProtectedRoute>
              }
            />
            <Route
              path="orcamentos"
              element={
                <ProtectedRoute allowedRoles={['CLIENTE']}>
                  <PlaceholderPage title="ORÇAMENTOS" />
                </ProtectedRoute>
              }
            />
            <Route
              path="perfil"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
