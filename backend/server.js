console.log('Starting server...');
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors');
try {
    console.log("server.js file is being executed");
require('dotenv').config();
} catch (err) {
    console.warn('Warning: dotenv failed to load:', err && err.code ? `${err.code} ${err.message}` : err);
}
const productRoutes = require('./routes/product')
const adminRoutes = require('./routes/admin')
const contactRoutes = require('./routes/contact')
const aboutContentRoutes = require('./routes/aboutContent')
const contentRoutes = require('./routes/content')
const uploadRoutes = require('./routes/upload')
const Visit = require('./models/Visit')

const app = express();

let mongoConnectionPromise = null;

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (mongoConnectionPromise) return mongoConnectionPromise;

  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    throw new Error('MONGO_URL is not set');
  }

  mongoConnectionPromise = mongoose.connect(mongoUrl, {
    serverSelectionTimeoutMS: 10000
  });

  try {
    await mongoConnectionPromise;
  } catch (err) {
    mongoConnectionPromise = null;
    throw err;
  }

  return mongoose.connection;
};

app.use(morgan('dev'));
const vercelOriginRegex = /^https:\/\/ko-shalom(?:-[a-z0-9]+)?\.vercel\.app$/i;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin === 'http://localhost:5173') return callback(null, true);
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return callback(null, true);
    if (vercelOriginRegex.test(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Welcome to the Shalom API');
});

app.use('/api', async (req, res, next) => {
  try {
    await connectToDatabase();
    return next();
  } catch (err) {
    console.error('Database connection failed:', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'Database connection failed', details: err?.message || String(err) });
  }
});

app.use('/api', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/about-content', aboutContentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

if (require.main === module) {
  console.log('Inside main module');
  const PORT = process.env.PORT || 4001;
  const startServer = () => {
    app.listen(PORT, () => {
      console.log('app is running on localhost:' + PORT);
    });
  };

  connectToDatabase()
    .then(() => {
      console.log('connected to db');
      startServer();
    })
    .catch((err) => {
      console.error('Error connecting to database:', err && err.stack ? err.stack : err);
      process.exitCode = 1;
    });
}

module.exports = app;
