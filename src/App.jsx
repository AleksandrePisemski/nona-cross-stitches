import './styles/App.css'
import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router'
import AppRoutes from './AppRoute'
import Footer from './components/layout/Footer.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { CustomerAccountProvider } from './context/CustomerAccountContext.jsx'

function AppContent() {
  const { pathname, search } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, search])

  return <div className="app">
    <AppRoutes />
    {!pathname.startsWith("/admin") && pathname !== "/checkout" && <Footer />}
  </div>
}

function App() {
  return <CustomerAccountProvider><CartProvider><AppContent /></CartProvider></CustomerAccountProvider>
}

export default App
