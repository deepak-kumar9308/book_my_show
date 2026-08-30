require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Seat = require('../models/Seat');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await User.deleteMany();
        await Movie.deleteMany();
        await Theatre.deleteMany();
        await Show.deleteMany();
        await Seat.deleteMany();

        // 1. Create Admin & User
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);
        
        await User.create([
            { name: 'Admin User', email: 'admin@example.com', password, role: 'admin' },
            { name: 'Regular User', email: 'user@example.com', password, role: 'user' }
        ]);

        // 2. Create Movies
        const movies = await Movie.insertMany([
            {
                title: 'Avengers: Endgame',
                description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos actions.',
                poster: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg',
                backdrop: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
                genre: ['Action', 'Adventure', 'Drama'],
                language: 'English',
                duration: '3h 1m',
                releaseDate: new Date('2019-04-26'),
                rating: 8.4,
                cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo'],
                director: 'Anthony Russo, Joe Russo'
            },
            {
                title: 'Inception',
                description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
                poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
                backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
                genre: ['Action', 'Adventure', 'Sci-Fi'],
                language: 'English',
                duration: '2h 28m',
                releaseDate: new Date('2010-07-16'),
                rating: 8.8,
                cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
                director: 'Christopher Nolan'
            },
            {
                title: 'The Dark Knight',
                description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
                poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NjAwXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
                backdrop: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
                genre: ['Action', 'Crime', 'Drama'],
                language: 'English',
                duration: '2h 32m',
                releaseDate: new Date('2008-07-18'),
                rating: 9.0,
                cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
                director: 'Christopher Nolan'
            }
        ]);

        // 3. Create Theatres
        const theatres = await Theatre.insertMany([
            {
                name: 'PVR Cinemas',
                city: 'Delhi',
                address: 'Select Citywalk, Saket',
                screens: [
                    { name: 'Screen 1', totalSeats: 60, seatLayout: { rows: 6, columns: 10 } },
                    { name: 'Screen 2 (IMAX)', totalSeats: 80, seatLayout: { rows: 8, columns: 10 } }
                ]
            },
            {
                name: 'INOX Laserplex',
                city: 'Delhi',
                address: 'Nehru Place',
                screens: [
                    { name: 'Screen A', totalSeats: 50, seatLayout: { rows: 5, columns: 10 } }
                ]
            }
        ]);

        // 4. Create Shows & Seats
        const showsToCreate = [];
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        showsToCreate.push({
            movieId: movies[0]._id,
            theatreId: theatres[0]._id,
            screenId: theatres[0].screens[0]._id,
            date: today,
            startTime: '10:00 AM',
            endTime: '01:00 PM',
            price: 250
        });

        showsToCreate.push({
            movieId: movies[0]._id,
            theatreId: theatres[0]._id,
            screenId: theatres[0].screens[1]._id, // IMAX
            date: today,
            startTime: '02:00 PM',
            endTime: '05:00 PM',
            price: 450
        });
        
        showsToCreate.push({
            movieId: movies[0]._id,
            theatreId: theatres[1]._id,
            screenId: theatres[1].screens[0]._id,
            date: today,
            startTime: '06:30 PM',
            endTime: '09:30 PM',
            price: 300
        });

        const createdShows = await Show.insertMany(showsToCreate);

        // Generate Seats for each show based on screen layout
        const seats = [];
        for (let show of createdShows) {
            const theatre = theatres.find(t => t._id.toString() === show.theatreId.toString());
            const screen = theatre.screens.id(show.screenId);
            
            for (let r = 0; r < screen.seatLayout.rows; r++) {
                const rowChar = String.fromCharCode(65 + r);
                for (let c = 1; c <= screen.seatLayout.columns; c++) {
                    const type = r < 2 ? 'Premium' : 'Standard';
                    const price = r < 2 ? show.price + 100 : show.price;
                    
                    // Randomly make a few seats booked for realism
                    const rand = Math.random();
                    const status = rand < 0.1 ? 'BOOKED' : 'AVAILABLE';

                    seats.push({
                        showId: show._id,
                        seatNumber: `${rowChar}${c}`,
                        row: rowChar,
                        type,
                        price,
                        status
                    });
                }
            }
        }
        await Seat.insertMany(seats);

        console.log('Data Imported successfully');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

connectDB().then(() => {
    importData();
});
