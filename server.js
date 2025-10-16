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
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/airport_facilities';

const isRunningOnRender = !!process.env.RENDER || process.env.NODE_ENV === 'production';

function maskUri(uri) {
  if (!uri) return null;
  try {
    // mask password if present for logs
    if (uri.startsWith('mongodb+srv://') || uri.startsWith('mongodb://')) {
      return uri.replace(/:(.*)@/, ':******@');
    }
    return '***';
  } catch (e) {
    return '***';
  }
}

if (!process.env.MONGODB_URI && isRunningOnRender) {
  console.error('\nERROR: MONGODB_URI is not set in the environment.');
  console.error('Set MONGODB_URI to a hosted MongoDB connection string (Atlas or managed DB) in Render environment variables.');
  process.exit(1);
}

console.log('Using MongoDB URI:', maskUri(mongoUri) || 'none');

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected');
    // start server after DB connected
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    if (isRunningOnRender) {
      console.error('\nHint: On Render ensure MONGODB_URI is set and points to a hosted DB (Atlas or Render Managed).');
      process.exit(1);
    }

    console.warn('Proceeding without MongoDB in development (server will start but DB operations may fail).');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port} (no DB)`);
    });
  });

// Models
const Incident = require('./src/models/Incident');

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/incidents', require('./src/routes/incidents'));

// Health endpoint
// Health endpoint shows DB state
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection && mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
  res.json({ status: 'ok', db: { state: dbState, status: dbStatus } });
});

// Readiness endpoint for platform health checks - returns 200 only when DB is connected
app.get('/api/ready', (req, res) => {
  const dbState = mongoose.connection && mongoose.connection.readyState;
  if (dbState === 1) return res.sendStatus(200);
  return res.status(503).json({ ready: false, db: { state: dbState || 0 } });
});

// Serve static frontend
app.use(express.static(path.join(__dirname, 'frontend-angular/dist/frontend-angular')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-angular/dist/frontend-angular', 'index.html'));
});



