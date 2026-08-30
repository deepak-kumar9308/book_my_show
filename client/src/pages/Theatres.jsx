import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { format, addDays } from 'date-fns';

const Theatres = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const movieId = searchParams.get('movie');

    const [shows, setShows] = useState([]);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Date selection (today + next 2 days)
    const dates = [0, 1, 2].map(days => addDays(new Date(), days));
    const [selectedDate, setSelectedDate] = useState(dates[0]);

    useEffect(() => {
        if (!movieId) {
            navigate('/movies');
            return;
        }

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const [movieRes, showsRes] = await Promise.all([
                    api.get(`/movies/${movieId}`),
                    api.get(`/shows?movieId=${movieId}&date=${selectedDate.toISOString()}`)
                ]);
                setMovie(movieRes.data.data);
                
                // Group shows by theatre
                const groupedShows = {};
                showsRes.data.data.forEach(show => {
                    const tId = show.theatreId._id;
                    if (!groupedShows[tId]) {
                        groupedShows[tId] = {
                            theatre: show.theatreId,
                            shows: []
                        };
                    }
                    groupedShows[tId].shows.push(show);
                });
                
                // Sort shows by time
                Object.values(groupedShows).forEach(group => {
                    group.shows.sort((a, b) => a.startTime.localeCompare(b.startTime));
                });

                setShows(Object.values(groupedShows));
            } catch (error) {
                console.error("Error fetching shows", error);
            }
            setLoading(false);
        };
        fetchDetails();
    }, [movieId, selectedDate, navigate]);

    if (loading) return <div className="text-center text-white py-20 text-xl animate-pulse">Loading shows...</div>;

    return (
        <div className="text-light">
            {movie && (
                <div className="mb-8 border-b border-gray-700 pb-6 flex items-center space-x-6">
                    <img src={movie.poster} alt={movie.title} className="w-24 rounded shadow-lg" />
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
                        <p className="text-gray-400">{movie.genre.join(', ')} | {movie.language} | {movie.duration}</p>
                    </div>
                </div>
            )}

            {/* Date Selector */}
            <div className="flex space-x-4 mb-8">
                {dates.map((date, i) => {
                    const isSelected = selectedDate.toDateString() === date.toDateString();
                    return (
                        <button
                            key={i}
                            onClick={() => setSelectedDate(date)}
                            className={`px-6 py-3 rounded-lg text-center transition ${isSelected ? 'bg-primary text-white font-bold' : 'bg-secondary text-gray-300 hover:bg-gray-700'}`}
                        >
                            <div className="text-xs uppercase">{format(date, 'MMM')}</div>
                            <div className="text-xl">{format(date, 'dd')}</div>
                            <div className="text-xs">{format(date, 'EEE')}</div>
                        </button>
                    );
                })}
            </div>

            {/* Theatres List */}
            <div className="space-y-6">
                {shows.length > 0 ? shows.map(group => (
                    <div key={group.theatre._id} className="bg-secondary p-6 rounded-lg shadow-lg flex flex-col md:flex-row md:items-center">
                        <div className="md:w-1/3 mb-4 md:mb-0 border-r border-gray-700 md:pr-6">
                            <h3 className="text-xl font-bold flex items-center mb-2">
                                <span className="mr-2">🎬</span> {group.theatre.name}
                            </h3>
                            <p className="text-gray-400 text-sm flex flex-wrap"><span className="mr-1">📍</span> {group.theatre.address}</p>
                        </div>
                        <div className="md:w-2/3 md:pl-6 flex flex-wrap gap-4">
                            {group.shows.map(show => (
                                <Link 
                                    to={`/seats/${show._id}`} 
                                    key={show._id}
                                    className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2 rounded transition font-medium"
                                >
                                    {show.startTime}
                                </Link>
                            ))}
                        </div>
                    </div>
                )) : (
                    <div className="text-center text-gray-400 py-12 bg-secondary rounded-lg">
                        <p>No shows available for this date.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Theatres;
