const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'QuickCart API is running' });
});

// API catch-all
app.get('/api/*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Try to serve static files if they exist
const staticPath = path.join(__dirname, '../client/dist');
try {
  if (fs.existsSync(staticPath)) {
    app.use(express.static(staticPath));
    console.log('📦 Serving static files from /client/dist');
  }
} catch (err) {
  console.log('⚠️  No static files found at /client/dist');
}

// Frontend catch-all - serve index.html for SPA routing or fallback
app.get('*', (req, res) => {
  // Try to serve index.html if it exists
  const indexPath = path.join(__dirname, '../client/dist/index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  // Fallback response
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
        </style>
      </head>
      <body>
        <h1>QuickCart Backend is Running</h1>
        <p>API is up and running at <span class="status">/api</span></p>
        <p>Try: <a href="/api/health">/api/health</a></p>
        <p><small>Frontend is not built. Run <code>npm run build</code> in the client directory.</small></p>
      </body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 QuickCart Server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Access: http://localhost:${PORT}`);
});