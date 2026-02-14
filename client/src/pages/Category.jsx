import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function Category() {
    const { categoryId } = useParams();
    const { categories, fetchProductsByCategory } = useApp();
    const { fetchCart } = useCart();
    const [products, setProducts] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [loading, setLoading] = useState(true);

    const currentCategory = categories.find(c => c.id === categoryId);

    useEffect(() => {
        fetchCart();
        setLoading(true);
        fetchProductsByCategory(categoryId).then(data => {
            setProducts(data);
            setLoading(false);
        });
    }, [categoryId]);

    const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
            case 'price_asc': return a.price - b.price;
            case 'price_desc': return b.price - a.price;
            case 'rating': return b.rating - a.rating;
            case 'discount':
                return ((b.mrp - b.price) / b.mrp) - ((a.mrp - a.price) / a.mrp);
            default: return 0;
        }
    });

    return (
        <div className="category-page page-enter">
            {/* Sidebar */}
            <div className="category-sidebar">
                {categories.map(cat => (
                    <Link
                        key={cat.id}
                        to={`/category/${cat.id}`}
                        className={`sidebar-item ${cat.id === categoryId ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">{cat.icon}</span>
                        <span>{cat.name}</span>
                    </Link>
                ))}
            </div>

            {/* Products */}
            <div className="category-products">
                <div className="category-products-header">
                    <h2>
                        {currentCategory?.icon} {currentCategory?.name || 'Products'}
                        <span style={{ fontSize: '14px', color: '#999', fontWeight: '400', marginLeft: '8px' }}>
                            ({sortedProducts.length} items)
                        </span>
                    </h2>
                    <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="">Sort by</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                        <option value="discount">Best Discount</option>
                    </select>
                </div>

                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="products-grid">
                        {sortedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
