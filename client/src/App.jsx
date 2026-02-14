import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import ProductModal from './components/ProductModal'
import Home from './pages/Home'
import Category from './pages/Category'
import Cart from './pages/Cart'
import Search from './pages/Search'
import Login from './pages/Login'
import OrderTracking from './pages/OrderTracking'
import { useApp } from './context/AppContext'

function App() {
    const { selectedProduct, setSelectedProduct } = useApp();

    return (
        <div className="app">
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/category/:categoryId" element={<Category />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/orders" element={<OrderTracking />} />
                </Routes>
            </main>
            <BottomNav />
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}

export default App
