import { Routes, Route } from 'react-router'
import HomePage from './pages/home/HomePage'
import Catalog from './pages/catalog/CatalogPage.jsx'
import ProductDetailsPage from './pages/modal/ProductDetailsPage.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'
import DeliveryAndPayment from './pages/DeliveryAndPayment.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Contact from './pages/Contact.jsx'
import FAQ from './pages/FAQ.jsx'
import TermsAndConditions from './pages/legal/TermsAndConditions.jsx'
import PrivacyPolicy from './pages/legal/PrivacyPolicy.jsx'
import ReturnsRefundPolicy from './pages/legal/ReturnsRefundPolicy.jsx'
import Stores from './pages/Stores.jsx'
import Careers from './pages/Careers.jsx'
import InstallmentFinancing from './pages/InstallmentFinancing.jsx'
import SearchResults from './pages/SearchResults.jsx'

function AppRoutes() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/catalog" element={<Catalog />} />
    <Route path="/search" element={<SearchResults />} />
    <Route path="/products/:slug" element={<ProductDetailsPage />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/order-confirmation" element={<OrderConfirmation />} />
    <Route path="/delivery-payment" element={<DeliveryAndPayment />} />
    <Route path="/about" element={<AboutUs />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/faq" element={<FAQ />} />
    <Route path="/terms" element={<TermsAndConditions />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />
    <Route path="/warranty-returns" element={<ReturnsRefundPolicy />} />
    <Route path="/stores" element={<Stores />} />
    <Route path="/careers" element={<Careers />} />
    <Route path="/installment-financing" element={<InstallmentFinancing />} />
  </Routes>
}

export default AppRoutes
