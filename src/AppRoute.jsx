import { Routes, Route } from 'react-router'
import HomePage from './pages/home/HomePage'
import Catalog from './pages/catalog/CatalogPage.jsx'
import ProductDetailsPage from './pages/modal/ProductDetailsPage.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'
import DeliveryAndPayment from './pages/DeliveryAndPayment.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/product/:slug" element={<ProductDetailsPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/delivery-payment" element={<DeliveryAndPayment />} />
    </Routes>
  )
}
export default AppRoutes
