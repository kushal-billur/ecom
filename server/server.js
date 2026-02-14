const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { getDb } = require('./db/init');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database on startup
getDb();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'QuickCart API is running' });
});

// API catch-all (must be after all API routes)
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Try to serve static files if they exist
// In Docker: __dirname is /app, staticPath = /app/client/dist
// In local dev: __dirname is <project>/server, staticPath = <project>/client/dist
const staticPath = path.join(__dirname, 'client', 'dist');
const localDevStaticPath = path.join(__dirname, '..', 'client', 'dist');

let resolvedStaticPath = null;
if (fs.existsSync(staticPath)) {
  resolvedStaticPath = staticPath;
} else if (fs.existsSync(localDevStaticPath)) {
  resolvedStaticPath = localDevStaticPath;
}

if (resolvedStaticPath) {
  console.log(`📦 Serving static files from: ${resolvedStaticPath}`);
  app.use(express.static(resolvedStaticPath));
} else {
  console.log('⚠️  No static files found at:', staticPath, 'or', localDevStaticPath);
}

// Frontend catch-all - serve index.html for SPA routing
app.get('*', (req, res) => {
  const indexFile = resolvedStaticPath ? path.join(resolvedStaticPath, 'index.html') : null;
  
  if (indexFile && fs.existsSync(indexFile)) {
    return res.sendFile(indexFile);
  }
  
  // Fallback response when frontend is not built
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>QuickCart</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #333; }
          .status { color: green; font-weight: bold; }
          code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
          pre { background: #f8f8f8; padding: 15px; border-radius: 5px; 
                text-align: left; max-width: 600px; margin: 20px auto; }
        </style>
      </head>
      <body>
        <h1>QuickCart Backend is Running</h1>
        <p>API is up and running at <span class="status">/api</span></p>
        <p>Try: <a href="/api/health">/api/health</a></p>
        <div>
          <p><small>Frontend is not built or not in the expected location.</small></p>
          <pre>Checked paths:\n- ${staticPath}\n- ${localDevStaticPath}</pre>
        </div>
      </body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 QuickCart Server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Access: http://localhost:${PORT}`);
  console.log(`📂 Static files: ${resolvedStaticPath || 'Not found'}`);
  console.log(`🔗 API Routes: /api/auth, /api/products, /api/categories, /api/banners, /api/cart, /api/orders`);
});