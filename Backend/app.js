require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const channelRoutes =  require('./routes/channelRoutes.js');
const videoRoutes = require('./routes/videoRoutes');  // ensure imported

const app = express();

// Connect Database
connectDB();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middlewares
app.use(cors(corsOptions));  // moved to top to apply globally
app.use(helmet());
app.use(express.json());

// Static folder for videos and thumbnails
// Static folder for videos - add CORS header explicitly here
const path = require('path');

const videoDir = path.join(__dirname, 'uploads/videos');
const thumbDir = path.join(__dirname, 'uploads/thumbnails');

// For videos - add CORS headers and serve statics
app.use('/videos', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // or restrict to your frontend origins
  next();
}, express.static(videoDir));

// For thumbnails - similar setup if you want
app.use('/thumbnails', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
}, express.static(thumbDir));


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/channel', channelRoutes);
app.use('/api/videos', videoRoutes);

app.get('/', (req, res) => {
  res.send('API Running');
});

module.exports = app;
