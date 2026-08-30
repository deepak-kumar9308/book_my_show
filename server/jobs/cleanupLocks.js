const cron = require('node-cron');
const Seat = require('../models/Seat');
const Transaction = require('../models/Transaction');

const startCleanupJob = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            
            // Find expired transactions that are still PENDING or PAYMENT_PENDING
            const expiredTransactions = await Transaction.find({
                status: { $in: ['PENDING', 'PAYMENT_PENDING'] },
                expiresAt: { $lt: now }
            });

            for (let transaction of expiredTransactions) {
                // Update transaction status
                transaction.status = 'EXPIRED';
                await transaction.save();

                // Release seats
                await Seat.updateMany(
                    { transactionId: transaction._id, status: 'LOCKED' },
                    { $set: { status: 'AVAILABLE', lockedBy: null, transactionId: null, expiresAt: null } }
                );
            }
        } catch (error) {
            console.error('Error in cleanup job:', error);
        }
    });
};

module.exports = startCleanupJob;
