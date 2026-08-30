const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic origin validation handling local + Vercel preview/prod deployments
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (Postman, server-to-server, mobile)
        if (!origin) return callback(null, true);

        // Allowed static origins (local dev + configured env variable)
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            process.env.CLIENT_URL
        ].filter(Boolean);

        // Regex matching any subdomains under your Vercel projects account
        const vercelRegex = /^https:\/\/book-my-show-.*-deepak-kumar9308s-projects\.vercel\.app$/;

        if (allowedOrigins.includes(origin) || vercelRegex.test(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error(`CORS policy violation: ${origin} is not allowed`));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(morgan('dev'));

// Base route health check
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

// Catch 404
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Global error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Server Error'
    });
});

module.exports = app;