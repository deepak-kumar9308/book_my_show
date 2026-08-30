const express = require('express');
const { getTransaction, cancelTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/:id')
    .get(protect, getTransaction);

router.route('/:id/cancel')
    .post(protect, cancelTransaction);

module.exports = router;
