import { useCart } from '../context/CartContext';

export default function ProductModal({ product, onClose }) {
    const { addToCart, updateQuantity, getItemQuantity } = useCart();
    const qty = getItemQuantity(product.id);
    const discount = product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>
                <div className="modal-product-image">
                    <img src={product.image} alt={product.name} />
                </div>
                <div className="modal-product-info">
                    <h2>{product.name}</h2>
                    <p className="weight">{product.weight}</p>
                    <div className="modal-price-row">
                        <span className="price">₹{product.price}</span>
                        {product.mrp > product.price && (
                            <>
                                <span className="mrp">₹{product.mrp}</span>
                                <span className="discount-badge">{discount}% OFF</span>
                            </>
                        )}
                    </div>
                    <div className="product-card-rating" style={{ marginBottom: '16px' }}>
                        <span className="star">★</span>
                        <span>{product.rating} ({product.reviews?.toLocaleString()} reviews)</span>
                    </div>
                    <p className="modal-description">{product.description}</p>

                    <div className="product-card-delivery" style={{ borderRadius: '10px', marginBottom: '16px' }}>
                        <span>⚡</span>
                        <span className="delivery-time">Get it in 10 MINS</span>
                    </div>

                    {qty === 0 ? (
                        <button className="modal-add-btn" onClick={() => addToCart(product.id)}>
                            🛒 Add to Cart — ₹{product.price}
                        </button>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                            <div className="qty-controls" style={{ fontSize: '16px' }}>
                                <button className="qty-btn" style={{ width: '40px', height: '40px', fontSize: '20px' }} onClick={() => updateQuantity(product.id, qty - 1)}>−</button>
                                <span className="qty-count" style={{ fontSize: '18px', minWidth: '32px' }}>{qty}</span>
                                <button className="qty-btn" style={{ width: '40px', height: '40px', fontSize: '20px' }} onClick={() => updateQuantity(product.id, qty + 1)}>+</button>
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: '700' }}>₹{product.price * qty}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
