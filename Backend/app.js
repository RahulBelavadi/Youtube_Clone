require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const commentRoutes = require('./routes/comments');

const connectDB = require('./config/db');
const channelRoutes = require('./routes/channelRoutes');
const videoRoutes = require('./routes/videoRoutes');

const app = express();
connectDB();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

const serveStaticWithCors = (urlPath, folderPath) => {
  app.use(urlPath, (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    next();
  }, express.static(folderPath));
};


serveStaticWithCors('/videos', path.join(__dirname, 'uploads/videos'));
serveStaticWithCors('/thumbnails', path.join(__dirname, 'uploads/thumbnails'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/channel', channelRoutes);
app.use('/api/videos', videoRoutes);
app.get('/', (req, res) => res.send('API Running'));
app.use('/api/comments', commentRoutes);


module.exports = app;
