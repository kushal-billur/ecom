import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import LocationSelector from '../components/LocationSelector';

function getUserId() {
    const user = localStorage.getItem('quickcart_user');
    if (user) {
        try { return JSON.parse(user).id; } catch (e) { }
    }
    return 'guest-user';
}

export default function Cart() {
    const { items, totals, fetchCart, updateQuantity, removeFromCart, clearCart } = useCart();
    const { placeOrder } = useApp();
    const navigate = useNavigate();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showLocationSelector, setShowLocationSelector] = useState(false);

    useEffect(() => { fetchCart(); }, []);

    const handleCheckout = async () => {
        if (items.length === 0) return;
        if (!selectedLocation) {
            setShowLocationSelector(true);
            return;
        }
        setPlacingOrder(true);
        const result = await placeOrder({
            userId: getUserId(),
            items,
            totals,
            address: selectedLocation,
            paymentMethod: 'COD'
        });
        if (result.success) {
            await clearCart();
            setOrderPlaced(true);
            setTimeout(() => {
                navigate('/orders');
            }, 2000);
        }
        setPlacingOrder(false);
    };

    if (orderPlaced) {
        return (
            <div className="cart-page page-enter">
                <div className="empty-cart">
                    <div className="empty-icon">🎉</div>
                    <h2>Order Placed Successfully!</h2>
                    <p>Your groceries will be delivered in 10 minutes</p>
                    <Link to="/orders" className="shop-now-btn">Track Order</Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="cart-page page-enter">
                <div className="empty-cart">
                    <div className="empty-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Add items to your cart to see them here</p>
                    <Link to="/" className="shop-now-btn">Start Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page page-enter">
            <div className="cart-header">
                <h1>🛒 My Cart</h1>
                <span className="item-count">{totals.totalQuantity} items</span>
            </div>

            <div className="cart-items">
                <div className="cart-delivery-banner">
                    ⚡ Delivery in 10 minutes
                </div>

                {items.map(item => (
                    <div key={item.productId} className="cart-item">
                        <div className="cart-item-image">
                            <img src={item.image} alt={item.name} />
                        </div>
                        <div className="cart-item-info">
                            <h4>{item.name}</h4>
                            <span className="cart-item-unit">{item.unit}</span>
                        </div>
                        <div className="cart-item-price">
                            <div className="price">₹{item.price * item.quantity}</div>
                            {item.mrp > item.price && (
                                <div className="mrp">₹{item.mrp * item.quantity}</div>
                            )}
                        </div>
                        <div className="qty-controls">
                            <button className="qty-btn" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                            <span className="qty-count">{item.quantity}</span>
                            <button className="qty-btn" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bill-summary">
                <h3>Bill Details</h3>
                <div className="bill-row">
                    <span className="label">Item total (MRP)</span>
                    <span className="value">₹{totals.mrpTotal}</span>
                </div>
                {totals.discount > 0 && (
                    <div className="bill-row discount">
                        <span className="label">Discount</span>
                        <span className="value">-₹{totals.discount}</span>
                    </div>
                )}
                <div className="bill-row">
                    <span className="label">Delivery fee</span>
                    <span className="value" style={{ color: totals.deliveryFee === 0 ? '#0C831F' : 'inherit' }}>
                        {totals.deliveryFee === 0 ? 'FREE' : `₹${totals.deliveryFee}`}
                    </span>
                </div>
                <div className="bill-row">
                    <span className="label">Handling charge</span>
                    <span className="value">₹{totals.handlingCharge}</span>
                </div>
                <div className="bill-row total">
                    <span className="label">Grand Total</span>
                    <span className="value">₹{totals.total}</span>
                </div>
            </div>

            <div className="checkout-bar">
                <div className="checkout-total">
                    <span className="total-label">Total</span>
                    <span className="total-amount">₹{totals.total}</span>
                </div>
                <button
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={placingOrder}
                >
                    {placingOrder ? 'Placing Order...' : 'Place Order →'}
                </button>
            </div>
        </div>
    );
}
