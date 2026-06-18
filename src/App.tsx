import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { MainLayout } from './components/layout/MainLayout'
import { AuthProvider } from './context/AuthContext'
import { ChatPage } from './pages/ChatPage'
import { CriarPedidoPage } from './pages/CriarPedidoPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { HomePage } from './pages/HomePage'
import { LoginPage, MechanicLoginPage } from './pages/LoginPage'
import { MecanicoPerfilPage } from './pages/MecanicoPerfilPage'
import { ParceiroPage } from './pages/ParceiroPage'
import { PedidosPage } from './pages/PedidosPage'
import { ProfilePage } from './pages/ProfilePage'
import { SAQPage } from './pages/SAQPage'
import { SignUpPage } from './pages/SignUpPage'
import { TarefasPage } from './pages/TarefasPage'
import { TermosPage } from './pages/TermosPage'

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
            <Route path="saq" element={<SAQPage />} />
            <Route path="parceiro" element={<ParceiroPage />} />
            <Route path="termos" element={<TermosPage />} />
            <Route
              path="pedidos"
              element={
                <ProtectedRoute>
                  <PedidosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="pedidos/novo"
              element={
                <ProtectedRoute allowedRoles={['CLIENTE']}>
                  <CriarPedidoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="chat/:pedidoId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="mecanico/:id"
              element={
                <ProtectedRoute>
                  <MecanicoPerfilPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="tarefas"
              element={
                <ProtectedRoute allowedRoles={['MECANICO']}>
                  <TarefasPage />
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
