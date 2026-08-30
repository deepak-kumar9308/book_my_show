import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await api.get(`/movies/${id}`);
                setMovie(res.data.data);
            } catch (error) {
                console.error("Error fetching movie", error);
            }
            setLoading(false);
        };
        fetchMovie();
    }, [id]);

    if (loading) return <div className="text-center text-white py-20 text-xl animate-pulse">Loading movie details...</div>;
    if (!movie) return <div className="text-center text-white py-20 text-xl">Movie not found</div>;

    return (
        <div className="text-light">
            <div 
                className="relative h-[60vh] rounded-xl overflow-hidden shadow-2xl mb-12"
                style={{
                    backgroundImage: `url(${movie.backdrop})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row items-end md:items-center space-y-6 md:space-y-0 md:space-x-8 z-10">
                    <img src={movie.poster} alt={movie.title} className="w-48 md:w-64 rounded-lg shadow-2xl border-4 border-gray-800" />
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
                        <div className="flex flex-wrap items-center space-x-4 mb-4 text-sm md:text-base">
                            <span className="bg-primary text-white font-bold px-3 py-1 rounded">★ {movie.rating}/10</span>
                            <span className="text-gray-300">{movie.duration}</span>
                            <span className="text-gray-300">{movie.language}</span>
                            <span className="text-gray-300">{new Date(movie.releaseDate).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-300 mb-6 text-lg">{movie.genre.join(' | ')}</p>
                        <button 
                            onClick={() => navigate(`/theatres?movie=${movie._id}`)}
                            className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-red-700 transition shadow-lg w-full md:w-auto"
                        >
                            Book Tickets
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-3">About the Movie</h2>
                    <p className="text-gray-300 leading-relaxed mb-8">{movie.description}</p>

                    <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-3">Cast</h2>
                    <div className="flex flex-wrap gap-4 mb-8">
                        {movie.cast.map((c, i) => (
                            <span key={i} className="bg-secondary px-4 py-2 rounded-full text-sm">{c}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-3">Director</h2>
                    <p className="text-gray-300 mb-8">{movie.director}</p>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
