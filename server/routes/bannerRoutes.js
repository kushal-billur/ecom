const express = require('express');
const router = express.Router();
const { getDb } = require('../db/init');

// GET all banners and deals
router.get('/', (req, res) => {
    const db = getDb();
    const banners = db.prepare('SELECT * FROM banners').all().map(b => ({
        id: b.id, title: b.title, subtitle: b.subtitle,
        description: b.description, bgColor: b.bg_color,
        textColor: b.text_color, tag: b.tag, image: b.image
    }));
    const deals = db.prepare('SELECT * FROM deals').all().map(d => ({
        id: d.id, title: d.title, discount: d.discount,
        image: d.image, bgColor: d.bg_color, expiresIn: d.expires_in
    }));
    res.json({ success: true, data: { banners, deals } });
});

module.exports = router;
