import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Download } from 'lucide-react';
import { toast } from 'react-toastify';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings/my');
                setBookings(res.data.data);
            } catch (error) {
                console.error("Error fetching bookings", error);
            }
            setLoading(false);
        };
        fetchBookings();
    }, []);

    const handleDownloadPDF = async (booking) => {
        try {
            const res = await api.get(`/bookings/${booking._id}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Receipt_${booking.bookingCode}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            toast.error("Failed to download receipt");
        }
    };

    if (loading) return <div className="text-center text-white py-20 text-xl animate-pulse">Loading bookings...</div>;

    return (
        <div className="max-w-5xl mx-auto text-light">
            <h1 className="text-3xl font-bold mb-8 border-l-4 border-primary pl-4">My Bookings</h1>

            {bookings.length > 0 ? (
                <div className="space-y-6">
                    {bookings.map(booking => (
                        <div key={booking._id} className="bg-secondary p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center space-x-6 md:w-2/3 mb-4 md:mb-0">
                                <img src={booking.movieId.poster} alt={booking.movieId.title} className="w-24 h-auto rounded shadow" />
                                <div>
                                    <h3 className="text-xl font-bold text-primary mb-1">{booking.movieId.title}</h3>
                                    <p className="text-gray-300 text-sm mb-1">{booking.theatreId.name}, {booking.theatreId.city}</p>
                                    <p className="text-gray-400 text-sm mb-2">{new Date(booking.showId.date).toLocaleDateString()} | {booking.showId.startTime}</p>
                                    <p className="text-sm font-medium">Seats: {booking.seats.map(s => s.seatNumber).join(', ')}</p>
                                </div>
                            </div>
                            
                            <div className="md:w-1/3 flex flex-col items-center md:items-end justify-center space-y-3 border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-6 w-full">
                                <div className="text-center md:text-right w-full">
                                    <p className="text-xs text-gray-400 uppercase">Booking Code</p>
                                    <p className="text-xl font-bold tracking-wider">{booking.bookingCode}</p>
                                </div>
                                <div className="text-center md:text-right w-full flex justify-between md:flex-col items-center md:items-end">
                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-gray-400 uppercase">Amount</p>
                                        <p className="font-bold text-lg">Rs. {booking.amount}</p>
                                    </div>
                                    <span className="bg-yellow-500 text-black px-3 py-1 rounded text-xs font-bold md:mt-2">PAY AT COUNTER</span>
                                </div>
                                
                                <button 
                                    onClick={() => handleDownloadPDF(booking)}
                                    className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 w-full py-2 rounded transition mt-2"
                                >
                                    <Download size={16} />
                                    <span className="text-sm">Download Ticket</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-secondary rounded-lg">
                    <p className="text-gray-400 text-lg mb-4">You have no active bookings.</p>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
