import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const API_BASE = '/api';

export function AppProvider({ children }) {
    const [categories, setCategories] = useState([]);
    const [banners, setBanners] = useState([]);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [catRes, bannerRes] = await Promise.all([
                    fetch(`${API_BASE}/categories`),
                    fetch(`${API_BASE}/banners`)
                ]);
                const catData = await catRes.json();
                const bannerData = await bannerRes.json();

                if (catData.success) setCategories(catData.data);
                if (bannerData.success) {
                    setBanners(bannerData.data.banners);
                    setDeals(bannerData.data.deals);
                }
            } catch (err) {
                console.error('Error fetching initial data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const searchProducts = useCallback(async (query) => {
        try {
            const res = await fetch(`${API_BASE}/products?search=${encodeURIComponent(query)}`);
            const data = await res.json();
            return data.success ? data.data : [];
        } catch (err) {
            console.error('Error searching products:', err);
            return [];
        }
    }, []);

    const fetchProductsByCategory = useCallback(async (categoryId) => {
        try {
            const res = await fetch(`${API_BASE}/products/category/${categoryId}`);
            const data = await res.json();
            return data.success ? data.data : [];
        } catch (err) {
            console.error('Error fetching products:', err);
            return [];
        }
    }, []);

    const fetchAllProducts = useCallback(async (params = {}) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await fetch(`${API_BASE}/products?${query}`);
            const data = await res.json();
            return data.success ? data.data : [];
        } catch (err) {
            console.error('Error fetching products:', err);
            return [];
        }
    }, []);

    const placeOrder = useCallback(async (orderData) => {
        try {
            const res = await fetch(`${API_BASE}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            const data = await res.json();
            return data;
        } catch (err) {
            console.error('Error placing order:', err);
            return { success: false };
        }
    }, []);

    const fetchOrders = useCallback(async (userId) => {
        try {
            const res = await fetch(`${API_BASE}/orders/${userId}`);
            const data = await res.json();
            return data.success ? data.data : [];
        } catch (err) {
            console.error('Error fetching orders:', err);
            return [];
        }
    }, []);

    return (
        <AppContext.Provider value={{
            categories, banners, deals, loading,
            selectedProduct, setSelectedProduct,
            searchProducts, fetchProductsByCategory,
            fetchAllProducts, placeOrder, fetchOrders
        }}>
            {children}
        </AppContext.Provider>
    );
}
