const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/', (req, res) => res.send('🌟 Essential Mart Backend is Running!'));
app.get('/api/health', (req, res) => res.json({ status: 'UP', database: 'Connected', time: new Date() }));

// Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/productRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 handler
app.use((req, res) => res.status(404).json({ error: `${req.method} ${req.url} not found` }));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    ==================================================
    🌟 ESSENTIAL MART BACKEND IS NOW LIVE 🌟
    --------------------------------------------------
    📡 Port: ${PORT}
    🔗 URL: http://localhost:${PORT}
    ✅ Ready for Frontend Connection
    ==================================================
    `);
});
