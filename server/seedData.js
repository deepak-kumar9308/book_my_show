const mongoose = require('mongoose');
require('dotenv').config();

const Movie = require('./models/Movie');
const Theatre = require('./models/Theatre');
const Show = require('./models/Show');
const Seat = require('./models/Seat');

const connectDB = require('./config/db');

const seedData = async () => {
    try {
        await connectDB();
        console.log('Database connected for seeding...');

        // Create a Movie if none exists
        let movie = await Movie.findOne();
        if (!movie) {
            movie = await Movie.create({
                title: 'Inception',
                description: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
                language: 'English',
                genre: ['Action', 'Sci-Fi'],
                duration: '2h 28m',
                cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
                director: 'Christopher Nolan',
                poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg'
            });
            console.log('Created demo movie: Inception');
        }

        // Create a Theatre if none exists
        let theatre = await Theatre.findOne();
        if (!theatre) {
            theatre = await Theatre.create({
                name: 'Cineplex IMAX',
                city: 'New York',
                address: '123 Main St, NY',
                screens: [{
                    name: 'Screen 1',
                    totalSeats: 100,
                    seatLayout: { rows: 10, columns: 10 }
                }]
            });
            console.log('Created demo theatre: Cineplex IMAX');
        }

        const screen = theatre.screens[0];

        console.log('Generating shows for the next 3 days...');
        const times = ['10:00 AM', '02:00 PM', '06:00 PM'];
        let showsCreated = 0;

        // Generate shows for today, tomorrow, and day after
        for (let i = 0; i < 3; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            date.setHours(0, 0, 0, 0); // Normalize date

            for (let time of times) {
                // Check if show already exists for this slot
                const existingShow = await Show.findOne({
                    movieId: movie._id,
                    theatreId: theatre._id,
                    date: date,
                    startTime: time
                });

                if (!existingShow) {
                    const show = await Show.create({
                        movieId: movie._id,
                        theatreId: theatre._id,
                        screenId: screen._id,
                        date: date,
                        startTime: time,
                        endTime: 'NA', // Or calculate it based on duration
                        price: 200
                    });

                    // Generate Seats for this show
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
                                type: r < 3 ? 'Premium' : 'Standard',
                                price: r < 3 ? show.price + 50 : show.price,
                                status: 'AVAILABLE'
                            });
                        }
                    }
                    await Seat.insertMany(seatsToInsert);
                    showsCreated++;
                }
            }
        }

        console.log(`Successfully created ${showsCreated} new shows (slots)!`);
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
