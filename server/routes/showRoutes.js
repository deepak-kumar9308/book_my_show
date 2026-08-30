const express = require('express');
const { getShows, getShow, createShow } = require('../controllers/showController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getShows)
    .post(protect, authorize('admin'), createShow);

router.route('/:id')
    .get(getShow);

module.exports = router;
