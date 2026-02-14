import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [user, setUser] = useState(null);
    const { totals } = useCart();
    const navigate = useNavigate();
    const searchRef = useRef(null);

    useEffect(() => {
        const stored = localStorage.getItem('quickcart_user');
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch (e) { }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                try {
                    const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=6`);
                    const data = await res.json();
                    if (data.success) {
                        setSuggestions(data.data);
                        setShowSuggestions(true);
                    }
                } catch (err) {
                    console.error(err);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowSuggestions(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('quickcart_token');
        localStorage.removeItem('quickcart_user');
        setUser(null);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-logo">
                    <div className="navbar-logo-icon">Q</div>
                    <div className="navbar-logo-text">
                        <h1>QuickCart</h1>
                        <span>Delivery in 10 mins</span>
                    </div>
                </Link>

                <div className="navbar-location">
                    <div>
                        <div className="loc-label">Delivery to</div>
                        <div className="loc-address">📍 Home — New Delhi ▾</div>
                    </div>
                </div>

                <div className="navbar-search" ref={searchRef}>
                    <form onSubmit={handleSearch}>
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search for atta, dal, coke and more..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                        />
                    </form>
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="search-suggestions">
                            {suggestions.map(item => (
                                <div
                                    key={item.id}
                                    className="search-suggestion-item"
                                    onClick={() => {
                                        navigate(`/search?q=${encodeURIComponent(item.name)}`);
                                        setSearchQuery(item.name);
                                        setShowSuggestions(false);
                                    }}
                                >
                                    <img src={item.image} alt={item.name} />
                                    <div className="suggestion-info">
                                        <h4>{item.name}</h4>
                                        <span>₹{item.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="navbar-actions">
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Link to="/orders" style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>
                                📦 Orders
                            </Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #0C831F, #16a34a)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontSize: '14px', fontWeight: '700'
                                }}>
                                    {(user.name || user.email || 'U')[0].toUpperCase()}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="navbar-login-btn"
                                    style={{ padding: '4px 12px', fontSize: '12px' }}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="navbar-login-btn">Login</Link>
                    )}
                    <Link to="/cart" className="navbar-cart-btn">
                        🛒 Cart
                        {totals.totalQuantity > 0 && (
                            <span className="cart-badge">{totals.totalQuantity}</span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
