import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { searchProducts } = useApp();
    const { fetchCart } = useCart();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
        setLoading(true);
        searchProducts(query).then(data => {
            setResults(data);
            setLoading(false);
        });
    }, [query]);

    return (
        <div className="search-page page-enter">
            <h2>
                {query ? `Results for "${query}"` : 'All Products'}
                <span className="search-result-count"> ({results.length} items)</span>
            </h2>

            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            ) : results.length === 0 ? (
                <div className="empty-cart">
                    <div className="empty-icon">🔍</div>
                    <h2>No results found</h2>
                    <p>Try searching for something else</p>
                </div>
            ) : (
                <div className="products-grid">
                    {results.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
