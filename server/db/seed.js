const { getDb } = require('./init');
const categories = require('../data/categories');
const products = require('../data/products');
const { banners, deals } = require('../data/banners');

function seed() {
    const db = getDb();

    // Clear existing data
    db.exec('DELETE FROM order_timeline');
    db.exec('DELETE FROM orders');
    db.exec('DELETE FROM cart_items');
    db.exec('DELETE FROM products');
    db.exec('DELETE FROM categories');
    db.exec('DELETE FROM banners');
    db.exec('DELETE FROM deals');

    // Seed categories
    const insertCat = db.prepare('INSERT INTO categories (id, name, icon, image, color, subcategories) VALUES (?, ?, ?, ?, ?, ?)');
    for (const cat of categories) {
        insertCat.run(cat.id, cat.name, cat.icon, cat.image, cat.color, JSON.stringify(cat.subcategories));
    }
    console.log(`✅ Seeded ${categories.length} categories`);

    // Seed products
    const insertProd = db.prepare('INSERT INTO products (id, name, category_id, subcategory, price, mrp, unit, weight, image, rating, reviews, in_stock, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (const p of products) {
        insertProd.run(p.id, p.name, p.categoryId, p.subcategory, p.price, p.mrp, p.unit, p.weight, p.image, p.rating, p.reviews, p.inStock ? 1 : 0, p.description);
    }
    console.log(`✅ Seeded ${products.length} products`);

    // Seed banners
    const insertBanner = db.prepare('INSERT INTO banners (id, title, subtitle, description, bg_color, text_color, tag, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const b of banners) {
        insertBanner.run(b.id, b.title, b.subtitle, b.description, b.bgColor, b.textColor, b.tag, b.image);
    }
    console.log(`✅ Seeded ${banners.length} banners`);

    // Seed deals
    const insertDeal = db.prepare('INSERT INTO deals (id, title, discount, image, bg_color, expires_in) VALUES (?, ?, ?, ?, ?, ?)');
    for (const d of deals) {
        insertDeal.run(d.id, d.title, d.discount, d.image, d.bgColor, d.expiresIn);
    }
    console.log(`✅ Seeded ${deals.length} deals`);

    console.log('\n🎉 Database seeded successfully!');
}

seed();
