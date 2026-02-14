import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import BannerCarousel from '../components/BannerCarousel';
import ProductCard from '../components/ProductCard';

export default function Home() {
    const { categories, banners, deals, loading, fetchAllProducts } = useApp();
    const { fetchCart } = useCart();
    const [popularProducts, setPopularProducts] = useState([]);
    const [dealTimers, setDealTimers] = useState({});

    useEffect(() => {
        fetchCart();
        fetchAllProducts({ sort: 'rating', limit: 12 }).then(setPopularProducts);
    }, []);

    // Deal timers
    useEffect(() => {
        const timers = {};
        deals.forEach(deal => {
            timers[deal.id] = deal.expiresIn;
        });
        setDealTimers(timers);

        const interval = setInterval(() => {
            setDealTimers(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(key => {
                    if (updated[key] > 0) updated[key]--;
                });
                return updated;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [deals]);

    const formatTimer = (seconds) => {
        if (!seconds || seconds <= 0) return '00:00:00';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="page-enter">
            {/* Delivery Strip */}
            <div className="delivery-strip">
                ⚡ Free delivery on orders above ₹199 • Delivery in 10 minutes
            </div>

            <div className="container">
                {/* Banner Carousel */}
                <BannerCarousel banners={banners} />

                {/* Categories */}
                <div className="section-header">
                    <h2>Shop by Category</h2>
                </div>
                <div className="category-grid">
                    {categories.map(cat => (
                        <Link
                            key={cat.id}
                            to={`/category/${cat.id}`}
                            className="category-card"
                        >
                            <div className="category-card-icon" style={{ background: cat.color }}>
                                {cat.icon}
                            </div>
                            <span className="category-card-name">{cat.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Deals */}
                {deals.length > 0 && (
                    <>
                        <div className="section-header">
                            <h2>🔥 Deals of the Day</h2>
                        </div>
                        <div className="deals-grid">
                            {deals.map(deal => (
                                <div key={deal.id} className="deal-card" style={{ background: deal.bgColor }}>
                                    <img className="deal-card-image" src={deal.image} alt={deal.title} />
                                    <div className="deal-card-info">
                                        <h3>{deal.title}</h3>
                                        <div className="deal-discount">{deal.discount}</div>
                                        <div className="deal-timer">
                                            ⏰ {formatTimer(dealTimers[deal.id])}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Popular Products */}
                <div className="section-header">
                    <h2>⭐ Popular Products</h2>
                    <Link to="/search?q=" className="see-all">See all →</Link>
                </div>
                <div className="products-grid">
                    {popularProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
