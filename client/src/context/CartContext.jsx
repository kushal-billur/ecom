import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const API_BASE = '/api';

function getUserId() {
    const user = localStorage.getItem('quickcart_user');
    if (user) {
        try { return JSON.parse(user).id; } catch (e) { }
    }
    return 'guest-user';
}

function getAuthHeaders() {
    const token = localStorage.getItem('quickcart_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
}

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [totals, setTotals] = useState({
        itemTotal: 0, mrpTotal: 0, discount: 0, deliveryFee: 0,
        handlingCharge: 0, total: 0, itemCount: 0, totalQuantity: 0
    });

    const fetchCart = useCallback(async () => {
        try {
            const userId = getUserId();
            const res = await fetch(`${API_BASE}/cart/${userId}`, { headers: getAuthHeaders() });
            const data = await res.json();
            if (data.success) {
                setItems(data.data.items);
                const { items: _, ...rest } = data.data;
                setTotals(rest);
            }
        } catch (err) {
            console.error('Error fetching cart:', err);
        }
    }, []);

    const addToCart = useCallback(async (productId) => {
        try {
            const userId = getUserId();
            const res = await fetch(`${API_BASE}/cart/${userId}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ productId, quantity: 1 })
            });
            const data = await res.json();
            if (data.success) {
                setItems(data.data.items);
                const { items: _, ...rest } = data.data;
                setTotals(rest);
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
        }
    }, []);

    const updateQuantity = useCallback(async (productId, quantity) => {
        try {
            const userId = getUserId();
            const res = await fetch(`${API_BASE}/cart/${userId}/${productId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ quantity })
            });
            const data = await res.json();
            if (data.success) {
                setItems(data.data.items);
                const { items: _, ...rest } = data.data;
                setTotals(rest);
            }
        } catch (err) {
            console.error('Error updating cart:', err);
        }
    }, []);

    const removeFromCart = useCallback(async (productId) => {
        try {
            const userId = getUserId();
            const res = await fetch(`${API_BASE}/cart/${userId}/${productId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            const data = await res.json();
            if (data.success) {
                setItems(data.data.items);
                const { items: _, ...rest } = data.data;
                setTotals(rest);
            }
        } catch (err) {
            console.error('Error removing from cart:', err);
        }
    }, []);

    const clearCart = useCallback(async () => {
        try {
            const userId = getUserId();
            const res = await fetch(`${API_BASE}/cart/${userId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            const data = await res.json();
            if (data.success) {
                setItems([]);
                const { items: _, ...rest } = data.data;
                setTotals(rest);
            }
        } catch (err) {
            console.error('Error clearing cart:', err);
        }
    }, []);

    const getItemQuantity = useCallback((productId) => {
        const item = items.find(i => i.productId === productId);
        return item ? item.quantity : 0;
    }, [items]);

    return (
        <CartContext.Provider value={{
            items, totals, fetchCart, addToCart, updateQuantity,
            removeFromCart, clearCart, getItemQuantity
        }}>
            {children}
        </CartContext.Provider>
    );
}
