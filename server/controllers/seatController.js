const Seat = require('../models/Seat');
const Transaction = require('../models/Transaction');
const Show = require('../models/Show');

// @desc    Get seats for a show
// @route   GET /api/shows/:showId/seats
// @access  Public
exports.getSeatsForShow = async (req, res, next) => {
    try {
        const seats = await Seat.find({ showId: req.params.showId });
        res.status(200).json({ success: true, count: seats.length, data: seats });
    } catch (error) {
        next(error);
    }
};

// @desc    Lock seats (start transaction)
// @route   POST /api/seats/lock
// @access  Private
exports.lockSeats = async (req, res, next) => {
    try {
        const { showId, seatIds } = req.body; // seatIds is an array of ObjectIds
        const userId = req.user.id;

        if (!seatIds || seatIds.length === 0) {
            return res.status(400).json({ success: false, message: 'No seats provided' });
        }

        const show = await Show.findById(showId);
        if (!show) {
            return res.status(404).json({ success: false, message: 'Show not found' });
        }

        // Calculate amount
        const seatsToLock = await Seat.find({ _id: { $in: seatIds }, showId });
        if (seatsToLock.length !== seatIds.length) {
            return res.status(400).json({ success: false, message: 'Some seats are invalid for this show' });
        }
        const totalAmount = seatsToLock.reduce((acc, seat) => acc + seat.price, 0);

        // 15 minutes from now
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Create a transaction first (PENDING)
        const transaction = await Transaction.create({
            userId,
            showId,
            seats: seatIds,
            amount: totalAmount,
            status: 'PENDING',
            expiresAt
        });

        // Attempt to atomically lock each seat
        const lockedSeats = [];
        let conflict = false;

        for (const seatId of seatIds) {
            // Atomic update: only lock if status is AVAILABLE or (status is LOCKED but expired)
            const result = await Seat.findOneAndUpdate(
                {
                    _id: seatId,
                    showId,
                    $or: [
                        { status: 'AVAILABLE' },
                        { status: 'LOCKED', expiresAt: { $lt: new Date() } }
                    ]
                },
                {
                    $set: {
                        status: 'LOCKED',
                        lockedBy: userId,
                        transactionId: transaction._id,
                        expiresAt: expiresAt
                    }
                },
                { new: true }
            );

            if (result) {
                lockedSeats.push(result._id);
            } else {
                // Conflict occurred! Seat is already booked or locked by someone else.
                conflict = true;
                break;
            }
        }

        if (conflict) {
            // Rollback: Release any seats we managed to lock in this attempt
            if (lockedSeats.length > 0) {
                await Seat.updateMany(
                    { _id: { $in: lockedSeats }, transactionId: transaction._id },
                    { $set: { status: 'AVAILABLE', lockedBy: null, transactionId: null, expiresAt: null } }
                );
            }
            
            // Mark transaction as REJECTED
            transaction.status = 'REJECTED';
            await transaction.save();

            return res.status(409).json({ 
                success: false, 
                code: 'SEAT_ALREADY_TAKEN',
                message: 'One or more selected seats are no longer available.' 
            });
        }

        // Success! Update transaction to PAYMENT_PENDING
        transaction.status = 'PAYMENT_PENDING';
        await transaction.save();

        res.status(200).json({ 
            success: true, 
            message: 'Seats locked successfully', 
            transaction 
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Release lock manually (if user cancels)
// @route   POST /api/seats/release
// @access  Private
exports.releaseSeats = async (req, res, next) => {
    try {
        const { transactionId } = req.body;
        
        const transaction = await Transaction.findOne({ _id: transactionId, userId: req.user.id });
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        if (transaction.status === 'CONFIRMED') {
            return res.status(400).json({ success: false, message: 'Cannot release booked seats' });
        }

        // Release seats
        await Seat.updateMany(
            { transactionId: transaction._id, status: 'LOCKED' },
            { $set: { status: 'AVAILABLE', lockedBy: null, transactionId: null, expiresAt: null } }
        );

        transaction.status = 'CANCELLED';
        await transaction.save();

        res.status(200).json({ success: true, message: 'Seats released' });
    } catch (error) {
        next(error);
    }
};
