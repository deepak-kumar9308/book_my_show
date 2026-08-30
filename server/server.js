require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const startCleanupJob = require('./jobs/cleanupLocks');

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
    await connectDB();
    
    // Start background jobs
    startCleanupJob();

    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
};

startServer();
