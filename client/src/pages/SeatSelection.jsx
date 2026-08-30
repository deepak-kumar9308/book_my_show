import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const SeatSelection = () => {
    const { showId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [show, setShow] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [locking, setLocking] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [showRes, seatsRes] = await Promise.all([
                    api.get(`/shows/${showId}`),
                    api.get(`/seats/shows/${showId}`)
                ]);
                setShow(showRes.data.data);
                
                // Group seats by row
                const grouped = {};
                seatsRes.data.data.forEach(seat => {
                    if (!grouped[seat.row]) {
                        grouped[seat.row] = [];
                    }
                    grouped[seat.row].push(seat);
                });
                
                // Sort rows and seats
                const sortedRows = Object.keys(grouped).sort();
                const sortedSeats = sortedRows.map(row => {
                    return grouped[row].sort((a, b) => {
                        const numA = parseInt(a.seatNumber.substring(1));
                        const numB = parseInt(b.seatNumber.substring(1));
                        return numA - numB;
                    });
                });

                setSeats(sortedSeats);
            } catch (error) {
                console.error("Error fetching seat layout", error);
            }
            setLoading(false);
        };
        fetchDetails();
    }, [showId]);

    const toggleSeat = (seat) => {
        if (seat.status !== 'AVAILABLE') return;
        
        const isSelected = selectedSeats.find(s => s._id === seat._id);
        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(s => s._id !== seat._id));
        } else {
            // Optional max seats limit
            if (selectedSeats.length >= 10) {
                toast.error("You can only select up to 10 seats");
                return;
            }
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const handleProceedToPayment = async () => {
        if (!user) {
            toast.error("Please login to proceed");
            navigate('/login');
            return;
        }

        if (selectedSeats.length === 0) {
            toast.error("Please select at least one seat");
            return;
        }

        setLocking(true);
        try {
            const seatIds = selectedSeats.map(s => s._id);
            const res = await api.post('/seats/lock', { showId, seatIds });
            
            if (res.data.success) {
                toast.success("Seats locked successfully!");
                navigate(`/payment/${res.data.transaction._id}`);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error("Sorry! A selected seat has already been booked. Please choose another seat.");
                // Refresh seat layout
                const seatsRes = await api.get(`/seats/shows/${showId}`);
                const grouped = {};
                seatsRes.data.data.forEach(seat => {
                    if (!grouped[seat.row]) grouped[seat.row] = [];
                    grouped[seat.row].push(seat);
                });
                const sortedRows = Object.keys(grouped).sort();
                const sortedSeats = sortedRows.map(row => {
                    return grouped[row].sort((a, b) => {
                        return parseInt(a.seatNumber.substring(1)) - parseInt(b.seatNumber.substring(1));
                    });
                });
                setSeats(sortedSeats);
                setSelectedSeats([]);
            } else {
                toast.error(error.response?.data?.message || "Error locking seats");
            }
        }
        setLocking(false);
    };

    if (loading) return <div className="text-center text-white py-20 text-xl animate-pulse">Loading seat layout...</div>;

    const ticketPrice = selectedSeats.reduce((acc, curr) => acc + curr.price, 0);
    const convenienceFee = selectedSeats.length * 40; // Flat 40 per seat
    const totalAmount = ticketPrice + convenienceFee;

    return (
        <div className="flex flex-col lg:flex-row gap-8 text-light">
            {/* Seat Layout Area */}
            <div className="lg:w-3/4 bg-secondary p-8 rounded-lg shadow-xl overflow-x-auto">
                <div className="min-w-[600px]">
                    <div className="text-center mb-12">
                        <div className="h-2 w-3/4 mx-auto bg-gray-400 rounded-t-[50%] opacity-50 shadow-[0_10px_20px_rgba(255,255,255,0.2)]"></div>
                        <p className="text-gray-400 mt-4 text-sm tracking-widest">SCREEN THIS WAY</p>
                    </div>

                    <div className="space-y-6 flex flex-col items-center">
                        {seats.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex items-center space-x-4">
                                <div className="w-6 text-center text-gray-500 font-bold">{row[0].row}</div>
                                <div className="flex space-x-2">
                                    {row.map(seat => {
                                        const isSelected = selectedSeats.find(s => s._id === seat._id);
                                        let bgColor = 'bg-gray-600 hover:bg-green-500 cursor-pointer';
                                        
                                        if (seat.status === 'LOCKED') bgColor = 'bg-yellow-500 cursor-not-allowed opacity-50';
                                        else if (seat.status === 'BOOKED') bgColor = 'bg-red-500 cursor-not-allowed opacity-50';
                                        else if (isSelected) bgColor = 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.7)]';
                                        
                                        return (
                                            <div 
                                                key={seat._id}
                                                onClick={() => toggleSeat(seat)}
                                                className={`w-8 h-8 rounded-t-lg border-b-4 border-gray-800 text-xs flex items-center justify-center transition ${bgColor}`}
                                                title={`Rs. ${seat.price}`}
                                            >
                                                {seat.seatNumber.substring(1)}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex justify-center space-x-8 text-sm">
                        <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-gray-600 rounded"></div><span>Available</span></div>
                        <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-green-500 rounded"></div><span>Selected</span></div>
                        <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-yellow-500 rounded"></div><span>Locked</span></div>
                        <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-red-500 rounded"></div><span>Booked</span></div>
                    </div>
                </div>
            </div>

            {/* Summary Area */}
            <div className="lg:w-1/4">
                {show && (
                    <div className="bg-secondary p-6 rounded-lg shadow-xl sticky top-24">
                        <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Booking Summary</h2>
                        <h3 className="text-lg text-primary font-bold">{show.movieId.title}</h3>
                        <p className="text-gray-400 text-sm mb-4">{show.theatreId.name}, {show.theatreId.city}</p>
                        <p className="text-sm mb-6">{new Date(show.date).toLocaleDateString()} | {show.startTime}</p>

                        {selectedSeats.length > 0 ? (
                            <>
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Seats ({selectedSeats.map(s => s.seatNumber).join(', ')})</span>
                                        <span>Rs. {ticketPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Convenience Fee</span>
                                        <span>Rs. {convenienceFee}</span>
                                    </div>
                                </div>
                                <div className="border-t border-gray-700 pt-4 mb-6 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>Rs. {totalAmount}</span>
                                </div>
                                <button 
                                    onClick={handleProceedToPayment}
                                    disabled={locking}
                                    className={`w-full py-3 rounded-lg font-bold text-lg transition ${locking ? 'bg-gray-600 cursor-wait' : 'bg-primary hover:bg-red-700 text-white shadow-[0_4px_14px_0_rgba(229,9,20,0.39)]'}`}
                                >
                                    {locking ? 'Locking...' : 'Proceed to Payment'}
                                </button>
                            </>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-2">💺</div>
                                <p>Select seats to proceed</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeatSelection;
