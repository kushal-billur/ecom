import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';

export default function ProductCard({ product }) {
    const { addToCart, updateQuantity, getItemQuantity } = useCart();
    const { setSelectedProduct } = useApp();
    const qty = getItemQuantity(product.id);
    const discount = product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;

    return (
        <div className="product-card">
            {discount > 0 && (
                <span className="product-card-badge">{discount}% OFF</span>
            )}
            <div
                className="product-card-image"
                onClick={() => setSelectedProduct(product)}
                style={{ cursor: 'pointer' }}
            >
                <img src={product.image} alt={product.name} />
            </div>
            <div className="product-card-delivery">
                <span>⚡</span>
                <span className="delivery-time">10 MINS</span>
            </div>
            <div className="product-card-info">
                <div
                    className="product-card-name"
                    onClick={() => setSelectedProduct(product)}
                    style={{ cursor: 'pointer' }}
                >
                    {product.name}
                </div>
                <div className="product-card-weight">{product.weight}</div>
                <div className="product-card-rating">
                    <span className="star">★</span>
                    <span>{product.rating}</span>
                </div>
                <div className="product-card-bottom">
                    <div className="product-card-price">
                        <span className="price">₹{product.price}</span>
                        {product.mrp > product.price && (
                            <span className="mrp">₹{product.mrp}</span>
                        )}
                    </div>
                    {qty === 0 ? (
                        <button className="add-btn" onClick={() => addToCart(product.id)}>ADD</button>
                    ) : (
                        <div className="qty-controls">
                            <button className="qty-btn" onClick={() => updateQuantity(product.id, qty - 1)}>−</button>
                            <span className="qty-count">{qty}</span>
                            <button className="qty-btn" onClick={() => updateQuantity(product.id, qty + 1)}>+</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
