const Theatre = require('../models/Theatre');

// @desc    Get all theatres
// @route   GET /api/theatres
// @access  Public
exports.getTheatres = async (req, res, next) => {
    try {
        const query = req.query.city ? { city: req.query.city } : {};
        const theatres = await Theatre.find(query);
        res.status(200).json({ success: true, count: theatres.length, data: theatres });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single theatre
// @route   GET /api/theatres/:id
// @access  Public
exports.getTheatre = async (req, res, next) => {
    try {
        const theatre = await Theatre.findById(req.params.id);
        if (!theatre) {
            return res.status(404).json({ success: false, message: 'Theatre not found' });
        }
        res.status(200).json({ success: true, data: theatre });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new theatre
// @route   POST /api/theatres
// @access  Private/Admin
exports.createTheatre = async (req, res, next) => {
    try {
        const theatre = await Theatre.create(req.body);
        res.status(201).json({ success: true, data: theatre });
    } catch (error) {
        next(error);
    }
};

// @desc    Add screen to theatre
// @route   POST /api/theatres/:id/screens
// @access  Private/Admin
exports.addScreen = async (req, res, next) => {
    try {
        const theatre = await Theatre.findById(req.params.id);
        if (!theatre) {
            return res.status(404).json({ success: false, message: 'Theatre not found' });
        }
        
        theatre.screens.push(req.body);
        await theatre.save();
        
        res.status(201).json({ success: true, data: theatre });
    } catch (error) {
        next(error);
    }
};
