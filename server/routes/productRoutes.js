const express = require('express');
const router = express.Router();
const { getDb } = require('../db/init');

// GET all products with optional filters
router.get('/', (req, res) => {
    const db = getDb();
    const { category, subcategory, search, sort, limit, page } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
        query += ' AND category_id = ?';
        params.push(category);
    }
    if (subcategory) {
        query += ' AND LOWER(subcategory) = LOWER(?)';
        params.push(subcategory);
    }
    if (search) {
        query += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(subcategory) LIKE ?)';
        const q = `%${search.toLowerCase()}%`;
        params.push(q, q, q);
    }

    if (sort === 'price_asc') query += ' ORDER BY price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY price DESC';
    else if (sort === 'rating') query += ' ORDER BY rating DESC';
    else if (sort === 'discount') query += ' ORDER BY ((mrp - price) * 1.0 / mrp) DESC';

    let products = db.prepare(query).all(...params);
    const total = products.length;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || products.length;
    const startIndex = (pageNum - 1) * limitNum;
    products = products.slice(startIndex, startIndex + limitNum);

    // Map fields to camelCase for frontend compatibility
    const data = products.map(mapProduct);

    res.json({ success: true, total, page: pageNum, data });
});

// GET single product
router.get('/:id', (req, res) => {
    const db = getDb();
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const related = db.prepare('SELECT * FROM products WHERE category_id = ? AND id != ? LIMIT 6').all(product.category_id, product.id);

    res.json({ success: true, data: mapProduct(product), related: related.map(mapProduct) });
});

// GET products by category
router.get('/category/:categoryId', (req, res) => {
    const db = getDb();
    const products = db.prepare('SELECT * FROM products WHERE category_id = ?').all(req.params.categoryId);
    res.json({ success: true, data: products.map(mapProduct) });
});

function mapProduct(p) {
    return {
        id: p.id,
        name: p.name,
        categoryId: p.category_id,
        subcategory: p.subcategory,
        price: p.price,
        mrp: p.mrp,
        unit: p.unit,
        weight: p.weight,
        image: p.image,
        rating: p.rating,
        reviews: p.reviews,
        inStock: !!p.in_stock,
        description: p.description
    };
}

module.exports = router;
