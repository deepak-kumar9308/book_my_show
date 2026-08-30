import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await api.get('/movies');
                setMovies(res.data.data);
            } catch (error) {
                console.error("Error fetching movies", error);
            }
            setLoading(false);
        };
        fetchMovies();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-secondary rounded-lg h-80"></div>
                ))}
            </div>
        );
    }

    return (
        <div>
            {/* Hero Section */}
            <div className="mb-12 bg-secondary rounded-xl p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl overflow-hidden relative">
                <div className="z-10 md:w-1/2">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Your Tickets For The Biggest Blockbusters</h1>
                    <p className="text-gray-300 mb-6 text-lg">Experience cinema like never before. Book your seats now for the most anticipated movies of the year.</p>
                </div>
                <div className="z-10 md:w-1/2 flex justify-end">
                    <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Cinema" className="rounded-lg shadow-xl w-full max-w-md object-cover h-64" />
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-secondary to-transparent opacity-90"></div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold border-l-4 border-primary pl-3">Now Showing</h2>
                <div className="text-primary hover:underline cursor-pointer">View All</div>
            </div>

            {movies && movies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {movies.map(movie => (
                        <Link to={`/movies/${movie._id}`} key={movie._id} className="group cursor-pointer">
                            <div className="bg-secondary rounded-lg overflow-hidden shadow-lg transition-transform transform group-hover:scale-105">
                                <img src={movie.poster} alt={movie.title} className="w-full h-64 object-cover" />
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-1 truncate">{movie.title}</h3>
                                    <p className="text-gray-400 text-sm mb-2">{movie.genre.join(' • ')}</p>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="bg-dark px-2 py-1 rounded text-green-400">★ {movie.rating}/10</span>
                                        <span className="text-gray-400">{movie.language}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-400 py-12">
                    <p>No movies available right now.</p>
                </div>
            )}
        </div>
    );
};

export default Home;
