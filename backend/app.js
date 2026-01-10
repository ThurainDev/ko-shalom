const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Visit = require('./models/Visit');

try {
  require('dotenv').config();
} catch (err) {
  console.warn('Warning: dotenv failed to load:', err && err.code ? `${err.code} ${err.message}` : err);
}

const productRoutes = require('./routes/product');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');
const aboutContentRoutes = require('./routes/aboutContent');
const contentRoutes = require('./routes/content');
const uploadRoutes = require('./routes/upload');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://www.shalomraynor.com',
  'https://shalomraynor.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowedOrigins list
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Allow any Vercel preview deployment
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// Log visits for public pages
app.use(async (req, res, next) => {
  if (
    req.method === 'GET' &&
    (
      req.path === '/' ||
      req.path.startsWith('/api/products') ||
      req.path.startsWith('/api/contact')
    )
  ) {
    try { await Visit.create({}); } catch (e) {}
  }
  next();
});

app.get('/', (req,res) => {
  return res.json({hello : 'world'});
});

app.use('/api/products', productRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/about-content', aboutContentRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/upload', uploadRoutes)

app.use('/uploads', express.static(__dirname + '/uploads'));

module.exports = app;
