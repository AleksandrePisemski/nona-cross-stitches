import './styles/App.css'
import AppRoutes from './AppRoute'
import { CartProvider } from './context/CartContext.jsx'





function App() {
  return (
    <CartProvider>
      <main className="app" aria-label="Blank page">
        <AppRoutes/>
      </main>
    </CartProvider>
  );
}

export default App
