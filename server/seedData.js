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

        console.log('Clearing old data...');
        await Movie.deleteMany({});
        await Theatre.deleteMany({});
        await Show.deleteMany({});
        await Seat.deleteMany({});

        const movieData = [
            {
                title: 'Inception',
                description: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
                language: 'English',
                genre: ['Action', 'Sci-Fi'],
                duration: '2h 28m',
                cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
                director: 'Christopher Nolan',
                poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbY-KG6to1c6TnWtwLvFbPva_pqcffh7UlWiOCjmUFuA&s=10',
                backdrop: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop',
                releaseDate: new Date('2010-07-16'),
                rating: 8.8
            },
            {
                title: 'The Dark Knight',
                description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.',
                language: 'English',
                genre: ['Action', 'Crime'],
                duration: '2h 32m',
                cast: ['Christian Bale', 'Heath Ledger'],
                director: 'Christopher Nolan',
                poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
                backdrop: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=2070&auto=format&fit=crop',
                releaseDate: new Date('2008-07-18'),
                rating: 9.0
            },
            {
                title: 'Interstellar',
                description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
                language: 'English',
                genre: ['Adventure', 'Sci-Fi'],
                duration: '2h 49m',
                cast: ['Matthew McConaughey', 'Anne Hathaway'],
                director: 'Christopher Nolan',
                poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPoFi4k7UHwCs31QC5CXreBDRt-Ivof82fSWya3MJhvA&s=10',
                backdrop: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGW7C6dkLMzUE-wYDb0t-Ze6UkSQlRzbkHdFbeuqJDeXCglJqSHLx52z2--O6a-gipTe5aIg&s=10',
                releaseDate: new Date('2014-11-07'),
                rating: 8.7
            },
            {
                title: 'The Matrix',
                description: 'A computer hacker learns from mysterious rebels about the true nature of his reality.',
                language: 'English',
                genre: ['Action', 'Sci-Fi'],
                duration: '2h 16m',
                cast: ['Keanu Reeves', 'Laurence Fishburne'],
                director: 'Lana Wachowski, Lilly Wachowski',
                poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyLYNVT9-YDFhJlPng3TEDIb_eVmbAZ2r_ElDOk61KgA&s=10',
                backdrop: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
                releaseDate: new Date('1999-03-31'),
                rating: 8.7
            },
            {
                title: 'Avengers: Endgame',
                description: 'After the devastating events of Infinity War, the Avengers assemble once more.',
                language: 'English',
                genre: ['Action', 'Adventure'],
                duration: '3h 1m',
                cast: ['Robert Downey Jr.', 'Chris Evans'],
                director: 'Anthony Russo, Joe Russo',
                poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
                backdrop: 'https://images.unsplash.com/photo-1561149877-84d268ba65b8?q=80&w=2066&auto=format&fit=crop',
                releaseDate: new Date('2019-04-26'),
                rating: 8.4
            },
            {
                title: 'Avatar',
                description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
                language: 'English',
                genre: ['Action', 'Adventure'],
                duration: '2h 42m',
                cast: ['Sam Worthington', 'Zoe Saldana'],
                director: 'James Cameron',
                poster: 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg',
                backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2071&auto=format&fit=crop',
                releaseDate: new Date('2009-12-18'),
                rating: 7.9
            },
            {
                title: 'Gladiator',
                description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
                language: 'English',
                genre: ['Action', 'Drama'],
                duration: '2h 35m',
                cast: ['Russell Crowe', 'Joaquin Phoenix'],
                director: 'Ridley Scott',
                poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwXUI5tWSmk9ISSNRnzxuR0i3l_5h0DSFf1C5iqP7NTw&s=10',
                backdrop: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=2070&auto=format&fit=crop',
                releaseDate: new Date('2000-05-05'),
                rating: 8.5
            },
            {
                title: 'Titanic',
                description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
                language: 'English',
                genre: ['Drama', 'Romance'],
                duration: '3h 14m',
                cast: ['Leonardo DiCaprio', 'Kate Winslet'],
                director: 'James Cameron',
                poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTbwB5zd0E--gDVGFgc0fys0I56ITel6y2z1L4F6XaNQ&s=10',
                backdrop: 'https://images.unsplash.com/photo-1555627237-775b5b031d2e?q=80&w=2070&auto=format&fit=crop',
                releaseDate: new Date('1997-12-19'),
                rating: 7.9
            },
            {
                title: 'The Shawshank Redemption',
                description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
                language: 'English',
                genre: ['Drama'],
                duration: '2h 22m',
                cast: ['Tim Robbins', 'Morgan Freeman'],
                director: 'Frank Darabont',
                poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
                backdrop: 'https://images.unsplash.com/photo-1533050487297-09b450131914?q=80&w=2070&auto=format&fit=crop',
                releaseDate: new Date('1994-09-23'),
                rating: 9.3
            },
            {
                title: 'The Godfather',
                description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
                language: 'English',
                genre: ['Crime', 'Drama'],
                duration: '2h 55m',
                cast: ['Marlon Brando', 'Al Pacino'],
                director: 'Francis Ford Coppola',
                poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
                backdrop: 'https://images.unsplash.com/photo-1626244791338-024b3b123d51?q=80&w=2070&auto=format&fit=crop',
                releaseDate: new Date('1972-03-24'),
                rating: 9.2
            }
        ];

        const movies = await Movie.insertMany(movieData);
        console.log('Created 10 demo movies');

        const theatre = await Theatre.create({
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

        const screen = theatre.screens[0];

        console.log('Generating shows for the next 3 days...');
        const times = ['10:00 AM', '02:00 PM', '06:00 PM'];
        let showsCreated = 0;

        for (let movie of movies) {
            // Generate shows for today, tomorrow, and day after
            for (let i = 0; i < 3; i++) {
                const date = new Date();
                date.setDate(date.getDate() + i);
                date.setHours(0, 0, 0, 0); // Normalize date

                for (let time of times) {
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
