const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration supporting dynamic environment origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL // Deployed Vercel frontend URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman, mobile apps, or curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error(`CORS policy violation: ${origin} is not allowed`));
        }
    },
    credentials: true
}));

// Helmet security configuration adjusted for cross-origin resource sharing
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(morgan('dev'));

// Base route health check (prevents "Cannot GET /" confusion on direct backend access)
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'BookMyShow Backend API is running smoothly.'
    });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/theatres', require('./routes/theatreRoutes'));
app.use('/api/shows', require('./routes/showRoutes'));
app.use('/api/seats', require('./routes/seatRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));

// Catch 404 for undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Server Error'
    });
});

module.exports = app;