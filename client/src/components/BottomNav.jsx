import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function BottomNav() {
    const location = useLocation();
    const { totals } = useCart();

    const navItems = [
        { path: '/', icon: '🏠', label: 'Home' },
        { path: '/category/cat-1', icon: '📋', label: 'Categories' },
        { path: '/cart', icon: '🛒', label: 'Cart', badge: totals.totalQuantity },
        { path: '/orders', icon: '📦', label: 'Orders' },
        { path: '/login', icon: '👤', label: 'Account' }
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map(item => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                </Link>
            ))}
        </nav>
    );
}
