const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Show',
        required: true
    },
    seatNumber: {
        type: String, // e.g. A1, A2
        required: true
    },
    row: {
        type: String, // e.g. A
        required: true
    },
    type: {
        type: String, // Premium, Standard, Economy
        default: 'Standard'
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'LOCKED', 'BOOKED'],
        default: 'AVAILABLE'
    },
    lockedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        default: null
    },
    expiresAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Ensure a seat number is unique per show
seatSchema.index({ showId: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model('Seat', seatSchema);
