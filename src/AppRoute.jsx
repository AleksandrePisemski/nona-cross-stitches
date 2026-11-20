import { Routes, Route } from 'react-router'
import HomePage from './pages/home/HomePage'
import Catalog from './pages/catalog/CatalogPage.jsx'
import ProductDetailsPage from './pages/modal/ProductDetailsPage.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/product/:slug" element={<ProductDetailsPage />} />
    </Routes>
  )
}
export default AppRoutes
