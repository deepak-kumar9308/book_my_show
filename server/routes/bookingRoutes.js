const express = require('express');
const { createBooking, getMyBookings, getBooking, generatePDF } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .post(protect, createBooking);

router.route('/my')
    .get(protect, getMyBookings);

router.route('/:id')
    .get(protect, getBooking);

router.route('/:id/pdf')
    .get(protect, generatePDF);

module.exports = router;
