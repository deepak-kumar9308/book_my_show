const express = require('express');
const { getSeatsForShow, lockSeats, releaseSeats } = require('../controllers/seatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/shows/:showId', getSeatsForShow);
router.post('/lock', protect, lockSeats);
router.post('/release', protect, releaseSeats);

module.exports = router;
