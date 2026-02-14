const express = require('express');
const router = express.Router();
const { getDb } = require('../db/init');

// GET all categories
router.get('/', (req, res) => {
    const db = getDb();
    const categories = db.prepare('SELECT * FROM categories').all();
    const data = categories.map(c => ({
        ...c,
        subcategories: JSON.parse(c.subcategories || '[]')
    }));
    res.json({ success: true, data });
});

// GET single category
router.get('/:id', (req, res) => {
    const db = getDb();
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    category.subcategories = JSON.parse(category.subcategories || '[]');
    res.json({ success: true, data: category });
});

module.exports = router;
