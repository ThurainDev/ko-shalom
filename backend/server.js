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

app.use(morgan('dev'));
const allowedOrigins = [
  'http://localhost:5173',
  'https://ko-shalom.vercel.app',
  'https://ko-shalom-oywf.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Welcome to the Shalom API');
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

  console.log('MONGO_URL:', process.env.MONGO_URL);
  if (process.env.MONGO_URL) {
    try {
    mongoose
      .connect(process.env.MONGO_URL)
      .then(() => {
        console.log('connected to db');
        startServer();
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
  }
}

module.exports = app;
