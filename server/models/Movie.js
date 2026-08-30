const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    poster: {
        type: String,
        required: [true, 'Please add a poster image URL']
    },
    backdrop: {
        type: String,
        required: [true, 'Please add a backdrop image URL']
    },
    genre: {
        type: [String],
        required: [true, 'Please add at least one genre']
    },
    language: {
        type: String,
        required: [true, 'Please add a language']
    },
    duration: {
        type: String,
        required: [true, 'Please add duration (e.g., 2h 30m)']
    },
    releaseDate: {
        type: Date,
        required: [true, 'Please add a release date']
    },
    rating: {
        type: Number,
        min: [0, 'Rating must be at least 0'],
        max: [10, 'Rating must can not be more than 10']
    },
    cast: {
        type: [String]
    },
    director: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);
