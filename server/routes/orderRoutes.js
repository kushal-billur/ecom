const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db/init');

// CREATE order
router.post('/', (req, res) => {
    const { userId, items, address, paymentMethod, totals } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const db = getDb();
    const orderId = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;

    const deliveryPartner = JSON.stringify({
        name: 'Rahul K.',
        phone: '+91 98765 43210',
        eta: '10 mins'
    });

    db.prepare(`
    INSERT INTO orders (id, user_id, items, address, payment_method, total, mrp_total, discount, delivery_fee, handling_charge, status, delivery_partner)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)
  `).run(
        orderId, userId, JSON.stringify(items),
        JSON.stringify(address || { line1: '123, Green Park', city: 'New Delhi', pincode: '110001' }),
        paymentMethod || 'COD',
        totals?.total || 0, totals?.mrpTotal || 0, totals?.discount || 0,
        totals?.deliveryFee || 0, totals?.handlingCharge || 0,
        deliveryPartner
    );

    // Create timeline entries
    const timelineSteps = [
        { status: 'confirmed', message: 'Order confirmed', completed_at: new Date().toISOString() },
        { status: 'packed', message: 'Items being packed', completed_at: null },
        { status: 'shipped', message: 'Out for delivery', completed_at: null },
        { status: 'delivered', message: 'Delivered', completed_at: null }
    ];

    const insertTimeline = db.prepare('INSERT INTO order_timeline (order_id, status, message, completed_at) VALUES (?, ?, ?, ?)');
    for (const step of timelineSteps) {
        insertTimeline.run(orderId, step.status, step.message, step.completed_at);
    }

    // Simulate order progress
    setTimeout(() => {
        try {
            db.prepare("UPDATE orders SET status = 'packed' WHERE id = ?").run(orderId);
            db.prepare("UPDATE order_timeline SET completed_at = ? WHERE order_id = ? AND status = 'packed'").run(new Date().toISOString(), orderId);
        } catch (e) { }
    }, 5000);

    setTimeout(() => {
        try {
            db.prepare("UPDATE orders SET status = 'shipped' WHERE id = ?").run(orderId);
            db.prepare("UPDATE order_timeline SET completed_at = ? WHERE order_id = ? AND status = 'shipped'").run(new Date().toISOString(), orderId);
        } catch (e) { }
    }, 15000);

    setTimeout(() => {
        try {
            db.prepare("UPDATE orders SET status = 'delivered' WHERE id = ?").run(orderId);
            db.prepare("UPDATE order_timeline SET completed_at = ? WHERE order_id = ? AND status = 'delivered'").run(new Date().toISOString(), orderId);
        } catch (e) { }
    }, 30000);

    const order = buildOrder(db, orderId);
    res.json({ success: true, data: order });
});

// GET all orders for user
router.get('/:userId', (req, res) => {
    const db = getDb();
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.params.userId);
    const data = orders.map(o => buildOrder(db, o.id));
    res.json({ success: true, data });
});

// GET single order
router.get('/:userId/:orderId', (req, res) => {
    const db = getDb();
    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.orderId, req.params.userId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: buildOrder(db, order.id) });
});

function buildOrder(db, orderId) {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    if (!order) return null;

    const timeline = db.prepare('SELECT * FROM order_timeline WHERE order_id = ? ORDER BY id ASC').all(orderId);

    return {
        id: order.id,
        userId: order.user_id,
        items: JSON.parse(order.items),
        address: JSON.parse(order.address || '{}'),
        paymentMethod: order.payment_method,
        status: order.status,
        totals: {
            total: order.total,
            mrpTotal: order.mrp_total,
            discount: order.discount,
            deliveryFee: order.delivery_fee,
            handlingCharge: order.handling_charge
        },
        timeline: timeline.map(t => ({
            status: t.status,
            time: t.completed_at,
            message: t.message
        })),
        deliveryPartner: JSON.parse(order.delivery_partner || '{}'),
        createdAt: order.created_at
    };
}

module.exports = router;
