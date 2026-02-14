const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'quickcart.db');

let db;

function getDb() {
    if (!db) {
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        initTables();
    }
    return db;
}

function initTables() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT DEFAULT '',
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      image TEXT,
      color TEXT,
      subcategories TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category_id TEXT NOT NULL,
      subcategory TEXT,
      price REAL NOT NULL,
      mrp REAL NOT NULL,
      unit TEXT,
      weight TEXT,
      image TEXT,
      rating REAL DEFAULT 0,
      reviews INTEGER DEFAULT 0,
      in_stock INTEGER DEFAULT 1,
      description TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS banners (
      id TEXT PRIMARY KEY,
      title TEXT,
      subtitle TEXT,
      description TEXT,
      bg_color TEXT,
      text_color TEXT,
      tag TEXT,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY,
      title TEXT,
      discount TEXT,
      image TEXT,
      bg_color TEXT,
      expires_in INTEGER
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      UNIQUE(user_id, product_id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      items TEXT NOT NULL,
      address TEXT,
      payment_method TEXT DEFAULT 'COD',
      total REAL,
      mrp_total REAL,
      discount REAL,
      delivery_fee REAL,
      handling_charge REAL,
      status TEXT DEFAULT 'confirmed',
      delivery_partner TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_timeline (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      status TEXT NOT NULL,
      message TEXT,
      completed_at TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );
  `);
}

module.exports = { getDb };
