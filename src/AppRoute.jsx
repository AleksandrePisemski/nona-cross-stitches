import { Routes, Route } from 'react-router'
import HomePage from './pages/home/HomePage'
import Catalog from './pages/catalog/Catalog'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/catalog" element={<Catalog />} />
    </Routes>
  )
}
export default AppRoutes