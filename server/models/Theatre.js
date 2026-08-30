const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a screen name (e.g., Screen 1)']
    },
    totalSeats: {
        type: Number,
        required: true
    },
    seatLayout: {
        // e.g., A matrix or representation of the rows/columns
        // For simplicity, we can store rows and columns counts, or an array of row objects
        rows: Number,
        columns: Number,
        // Could also define premium vs standard rows here
    }
});

const theatreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a theatre name']
    },
    city: {
        type: String,
        required: [true, 'Please add a city']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    screens: [screenSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Theatre', theatreSchema);
