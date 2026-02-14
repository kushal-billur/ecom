const express = require('express');
const router = express.Router();
const { getDb } = require('../db/init');

const calculateTotals = (cartItems) => {
    const itemTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const mrpTotal = cartItems.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);
    const discount = mrpTotal - itemTotal;
    const deliveryFee = itemTotal >= 199 ? 0 : 25;
    const handlingCharge = 2;
    const total = itemTotal + deliveryFee + handlingCharge;

    return {
        itemTotal, mrpTotal, discount, deliveryFee, handlingCharge, total,
        itemCount: cartItems.length,
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
};

const getCartItems = (userId) => {
    const db = getDb();
    return db.prepare(`
    SELECT ci.product_id as productId, ci.quantity, 
           p.name, p.price, p.mrp, p.image, p.unit, p.weight
    FROM cart_items ci 
    JOIN products p ON ci.product_id = p.id 
    WHERE ci.user_id = ?
  `).all(userId);
};

// GET cart
router.get('/:userId', (req, res) => {
    const items = getCartItems(req.params.userId);
    res.json({ success: true, data: { items, ...calculateTotals(items) } });
});

// ADD item to cart
router.post('/:userId', (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const db = getDb();

    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    db.prepare(`
    INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)
    ON CONFLICT(user_id, product_id) DO UPDATE SET quantity = quantity + ?
  `).run(req.params.userId, productId, quantity, quantity);

    const items = getCartItems(req.params.userId);
    res.json({ success: true, data: { items, ...calculateTotals(items) } });
});

// UPDATE item quantity
router.put('/:userId/:productId', (req, res) => {
    const { quantity } = req.body;
    const db = getDb();

    if (quantity <= 0) {
        db.prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?').run(req.params.userId, req.params.productId);
    } else {
        db.prepare('UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?').run(quantity, req.params.userId, req.params.productId);
    }

    const items = getCartItems(req.params.userId);
    res.json({ success: true, data: { items, ...calculateTotals(items) } });
});

// DELETE item from cart
router.delete('/:userId/:productId', (req, res) => {
    const db = getDb();
    db.prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?').run(req.params.userId, req.params.productId);
    const items = getCartItems(req.params.userId);
    res.json({ success: true, data: { items, ...calculateTotals(items) } });
});

// CLEAR cart
router.delete('/:userId', (req, res) => {
    const db = getDb();
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.params.userId);
    res.json({
        success: true,
        data: { items: [], itemTotal: 0, mrpTotal: 0, discount: 0, deliveryFee: 0, handlingCharge: 0, total: 0, itemCount: 0, totalQuantity: 0 }
    });
});

module.exports = router;
