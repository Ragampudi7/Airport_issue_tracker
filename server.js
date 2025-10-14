'use strict';

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Mongo connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/airport_facilities';
mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Models
const Incident = require('./src/models/Incident');

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/incidents', require('./src/routes/incidents'));

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


