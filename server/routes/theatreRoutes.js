const express = require('express');
const { getTheatres, getTheatre, createTheatre, addScreen } = require('../controllers/theatreController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getTheatres)
    .post(protect, authorize('admin'), createTheatre);

router.route('/:id')
    .get(getTheatre);

router.route('/:id/screens')
    .post(protect, authorize('admin'), addScreen);

module.exports = router;
