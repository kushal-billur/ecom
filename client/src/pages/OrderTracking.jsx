import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function getUserId() {
    const user = localStorage.getItem('quickcart_user');
    if (user) {
        try { return JSON.parse(user).id; } catch (e) { }
    }
    return 'guest-user';
}

export default function OrderTracking() {
    const { fetchOrders } = useApp();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            const data = await fetchOrders(getUserId());
            setOrders(data);
            setLoading(false);
        };
        loadOrders();

        const interval = setInterval(async () => {
            const data = await fetchOrders(getUserId());
            setOrders(data);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getStepState = (timeline, index, currentStatus) => {
        const statusOrder = ['confirmed', 'packed', 'shipped', 'delivered'];
        const currentIdx = statusOrder.indexOf(currentStatus);
        if (index < currentIdx) return 'completed';
        if (index === currentIdx) return 'active';
        return 'pending';
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="order-tracking-page page-enter">
                <div className="empty-cart">
                    <div className="empty-icon">📦</div>
                    <h2>No orders yet</h2>
                    <p>Your orders will appear here once you place one</p>
                    <Link to="/" className="shop-now-btn">Start Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="order-tracking-page page-enter">
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>📦 My Orders</h1>

            {orders.map(order => (
                <div key={order.id} className="order-card">
                    <div className="order-card-header">
                        <span className="order-id">{order.id}</span>
                        <span className={`order-status-badge ${order.status}`}>
                            {order.status}
                        </span>
                    </div>

                    <div style={{ marginBottom: '16px', fontSize: '13px', color: '#666' }}>
                        {order.items.map((item, i) => (
                            <span key={item.productId}>
                                {item.name} ×{item.quantity}
                                {i < order.items.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </div>

                    <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>
                        Total: ₹{order.totals?.total || '0'}
                    </div>

                    <div className="order-timeline">
                        {order.timeline.map((step, idx) => {
                            const state = getStepState(order.timeline, idx, order.status);
                            return (
                                <div key={idx} className={`timeline-step ${state}`}>
                                    <div className="timeline-dot"></div>
                                    <h4>{step.message}</h4>
                                    <p>
                                        {step.time
                                            ? new Date(step.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                                            : 'Pending'
                                        }
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {order.status !== 'delivered' && order.deliveryPartner?.name && (
                        <div className="delivery-partner-card">
                            <div className="delivery-partner-avatar">
                                {order.deliveryPartner.name[0]}
                            </div>
                            <div className="delivery-partner-info">
                                <h4>{order.deliveryPartner.name}</h4>
                                <p>Delivery Partner • ETA: {order.deliveryPartner.eta}</p>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
