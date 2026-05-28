import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { MainLayout } from './components/layout/MainLayout'
import { AuthProvider } from './context/AuthContext'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
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
            <Route path="esqueci-senha" element={<ForgotPasswordPage />} />
            <Route path="cadastro" element={<SignUpPage />} />
            <Route path="saq" element={<PlaceholderPage title="SAQ" />} />
            <Route
              path="parceiro"
              element={<PlaceholderPage title="SEJA UM PARCEIRO" />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
