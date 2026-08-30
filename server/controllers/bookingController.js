const Booking = require('../models/Booking');
const Transaction = require('../models/Transaction');
const Seat = require('../models/Seat');
const crypto = require('crypto');
const PDFDocument = require('pdfkit');

// Generate unique booking code
const generateBookingCode = () => {
    return 'CNT-' + crypto.randomBytes(3).toString('hex').toUpperCase();
};

// @desc    Complete transaction and create booking (Pay at Counter)
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
    try {
        const { transactionId } = req.body;

        const transaction = await Transaction.findOne({ _id: transactionId, userId: req.user.id });
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        if (transaction.status !== 'PAYMENT_PENDING') {
            return res.status(400).json({ success: false, message: 'Transaction is not in payment pending state' });
        }

        // Check if expired
        if (new Date() > new Date(transaction.expiresAt)) {
            // Expired during payment attempt
            transaction.status = 'EXPIRED';
            await transaction.save();

            // Release seats
            await Seat.updateMany(
                { transactionId: transaction._id, status: 'LOCKED' },
                { $set: { status: 'AVAILABLE', lockedBy: null, transactionId: null, expiresAt: null } }
            );

            return res.status(400).json({ success: false, message: 'Transaction time expired. Seats released.' });
        }

        // Proceed to book
        let bookingCode;
        let isUnique = false;
        while (!isUnique) {
            bookingCode = generateBookingCode();
            const existing = await Booking.findOne({ bookingCode });
            if (!existing) isUnique = true;
        }

        const Show = require('../models/Show');
        const show = await Show.findById(transaction.showId);

        const actualBooking = await Booking.create({
            userId: req.user.id,
            movieId: show.movieId,
            theatreId: show.theatreId,
            showId: show._id,
            transactionId: transaction._id,
            seats: transaction.seats,
            amount: transaction.amount,
            bookingCode,
            paymentMethod: 'PAY_AT_COUNTER',
            status: 'CONFIRMED'
        });

        // Mark seats as BOOKED permanently
        await Seat.updateMany(
            { transactionId: transaction._id },
            { $set: { status: 'BOOKED', expiresAt: null } } // Keep lockedBy and transactionId for history if needed
        );

        transaction.status = 'CONFIRMED';
        transaction.completedAt = new Date();
        await transaction.save();

        res.status(201).json({ success: true, message: 'Booking successful', data: actualBooking });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate('movieId', 'title poster')
            .populate('theatreId', 'name city')
            .populate('showId', 'date startTime')
            .populate('seats', 'seatNumber')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id })
            .populate('movieId')
            .populate('theatreId')
            .populate('showId')
            .populate('seats');
            
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};

// @desc    Generate PDF receipt
// @route   GET /api/bookings/:id/pdf
// @access  Private
exports.generatePDF = async (req, res, next) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id })
            .populate('movieId')
            .populate('theatreId')
            .populate('showId')
            .populate('seats');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const doc = new PDFDocument({ margin: 50 });
        
        let filename = `Receipt_${booking.bookingCode}.pdf`;
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // Header
        doc.fontSize(20).text('MOVIE TICKET RECEIPT', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text('---------------------------------------------------------');
        doc.moveDown();
        
        doc.fontSize(14).text(`Movie: ${booking.movieId.title}`);
        doc.fontSize(12).text(`Theatre: ${booking.theatreId.name}, ${booking.theatreId.city}`);
        doc.text(`Date: ${new Date(booking.showId.date).toLocaleDateString()}`);
        doc.text(`Time: ${booking.showId.startTime}`);
        
        const seatNumbers = booking.seats.map(s => s.seatNumber).join(', ');
        doc.text(`Seats: ${seatNumbers}`);
        doc.text(`Amount: Rs. ${booking.amount}`);
        doc.moveDown();
        
        doc.fontSize(14).text(`Booking Code: ${booking.bookingCode}`, { underline: true });
        doc.moveDown();
        doc.fontSize(12).text('---------------------------------------------------------');
        doc.moveDown();
        doc.fontSize(10).text('Show this receipt at the counter to pay and get the ticket.', { align: 'center' });
        
        doc.end();
    } catch (error) {
        next(error);
    }
};
