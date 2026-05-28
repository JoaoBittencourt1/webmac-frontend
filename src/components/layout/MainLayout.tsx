import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import './MainLayout.css'

export function MainLayout() {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-layout__content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
