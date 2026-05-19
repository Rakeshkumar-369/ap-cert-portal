// src/server.js
const config = require('./config'); // Load config hub
const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const securityHeaders = require('./middleware/securityHeaders');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./utils/logger');

// Routes
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const publicationRoutes = require('./routes/publicationRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
const profileRoutes = require('./routes/profileRoutes');
const vulnerabilityRoutes = require('./routes/vulnerabilityRoutes');
const cisaRoutes = require('./routes/cisaRoutes');

// Error Handler
const errorHandler = require('./middleware/errorMiddleware');
const { initCleanupJobs } = require('./services/cleanupService');

const app = express();

// Request ID (before everything else) ======
app.use((req, res, next) => {
  req.id = require('crypto').randomUUID();
  next();
});

// 1. Performance: HTTP Response Compression
app.use(compression());

// Hybrid Logging
if (config.env === 'production') {
  app.use(morgan('combined', { stream: logger.stream }));
} else {
  app.use(morgan('dev'));
}

// Initialize Background Tasks
initCleanupJobs();

// app.set('trust proxy', 'loopback'); // Uncomment if behind a proxy like Nginx

// Middlewares
app.use(securityHeaders);
app.use(cookieParser());
app.disable('x-powered-by');

app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));   // Limit JSON body to 1MB

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/vulnerability', vulnerabilityRoutes);
app.use('/api/cisa', cisaRoutes);

// Serve uploaded files (protected by path — only specific dirs exposed)
//app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- PRODUCTION SERVING LOGIC ---
if (config.env === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');

  // Serve static assets (js, css, images)
  app.use(express.static(frontendPath));

  // Catch-All: Support React Router by serving index.html for any non-API route
  app.get('/*anythinghereexceptspaceandnothing', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// 3. ERROR HANDLING MIDDLEWARE (Must be after routes)
app.use(errorHandler);

const PORT = config.port;
const HOST = config.host;

// Start server
const server = app.listen(PORT, HOST, () => {
  logger.info(`Server running on ${HOST}:${PORT}`);
  // Also log the network URL
  if (HOST === '0.0.0.0') {
    const networkInterfaces = require('os').networkInterfaces();
    Object.keys(networkInterfaces).forEach((interfaceName) => {
      networkInterfaces[interfaceName].forEach((interface) => {
        if (interface.family === 'IPv4' && !interface.internal) {
          logger.info(`Network access: http://${interface.address}:${PORT}`);
        }
      });
    });
  }
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}\n${err.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}\n${err.stack}`);
  server.close(() => process.exit(1));
});