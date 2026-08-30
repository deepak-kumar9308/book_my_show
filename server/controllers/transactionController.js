const Transaction = require('../models/Transaction');
const Seat = require('../models/Seat');

// @desc    Get a transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.id })
            .populate({
                path: 'showId',
                populate: [
                    { path: 'movieId', select: 'title poster' },
                    { path: 'theatreId', select: 'name city address' }
                ]
            })
            .populate('seats');

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel a transaction
// @route   POST /api/transactions/:id/cancel
// @access  Private
exports.cancelTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        if (transaction.status === 'CONFIRMED') {
            return res.status(400).json({ success: false, message: 'Cannot cancel confirmed transaction' });
        }

        // Release seats
        await Seat.updateMany(
            { transactionId: transaction._id, status: 'LOCKED' },
            { $set: { status: 'AVAILABLE', lockedBy: null, transactionId: null, expiresAt: null } }
        );

        transaction.status = 'CANCELLED';
        await transaction.save();

        res.status(200).json({ success: true, message: 'Transaction cancelled successfully' });
    } catch (error) {
        next(error);
    }
};
