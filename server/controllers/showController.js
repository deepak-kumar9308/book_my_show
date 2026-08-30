const Show = require('../models/Show');
const Theatre = require('../models/Theatre');
const Movie = require('../models/Movie');
const Seat = require('../models/Seat');

// @desc    Get all shows (with optional filtering by movie, theatre, date)
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res, next) => {
    try {
        const { movieId, theatreId, date } = req.query;
        let query = {};
        if (movieId) query.movieId = movieId;
        if (theatreId) query.theatreId = theatreId;
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0,0,0,0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23,59,59,999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        const shows = await Show.find(query).populate('movieId', 'title poster').populate('theatreId', 'name city');
        res.status(200).json({ success: true, count: shows.length, data: shows });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single show
// @route   GET /api/shows/:id
// @access  Public
exports.getShow = async (req, res, next) => {
    try {
        const show = await Show.findById(req.params.id)
            .populate('movieId')
            .populate('theatreId');
        if (!show) {
            return res.status(404).json({ success: false, message: 'Show not found' });
        }
        res.status(200).json({ success: true, data: show });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new show and initialize seats
// @route   POST /api/shows
// @access  Private/Admin
exports.createShow = async (req, res, next) => {
    try {
        const { movieId, theatreId, screenId, date, startTime, endTime, price } = req.body;

        const theatre = await Theatre.findById(theatreId);
        if (!theatre) return res.status(404).json({ success: false, message: 'Theatre not found' });

        const screen = theatre.screens.id(screenId);
        if (!screen) return res.status(404).json({ success: false, message: 'Screen not found' });

        const show = await Show.create(req.body);

        // Initialize seats for this show based on screen layout
        const seatsToInsert = [];
        const rows = screen.seatLayout.rows || 10;
        const cols = screen.seatLayout.columns || 10;

        for (let r = 0; r < rows; r++) {
            const rowChar = String.fromCharCode(65 + r); // A, B, C...
            for (let c = 1; c <= cols; c++) {
                seatsToInsert.push({
                    showId: show._id,
                    seatNumber: `${rowChar}${c}`,
                    row: rowChar,
                    type: r < 3 ? 'Premium' : 'Standard', // Example split
                    price: r < 3 ? price + 50 : price,
                    status: 'AVAILABLE'
                });
            }
        }
        await Seat.insertMany(seatsToInsert);

        res.status(201).json({ success: true, data: show });
    } catch (error) {
        next(error);
    }
};
