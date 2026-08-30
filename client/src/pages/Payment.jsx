import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Clock, Download, CheckCircle } from 'lucide-react';

const Payment = () => {
    const { transactionId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(null);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const res = await api.get(`/transactions/${transactionId}`);
                const tx = res.data.data;
                
                if (tx.status === 'CONFIRMED' || tx.status === 'EXPIRED' || tx.status === 'CANCELLED') {
                    toast.error(`Transaction is ${tx.status.toLowerCase()}`);
                    navigate('/movies');
                    return;
                }

                setTransaction(tx);
                
                // Calculate initial time left
                const expireTime = new Date(tx.expiresAt).getTime();
                const now = new Date().getTime();
                const diff = Math.max(0, Math.floor((expireTime - now) / 1000));
                
                if (diff === 0) {
                    handleExpire();
                } else {
                    setTimeLeft(diff);
                }

            } catch (error) {
                toast.error("Transaction not found");
                navigate('/movies');
            }
            setLoading(false);
        };
        
        fetchTransaction();
    }, [transactionId, navigate]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || bookingSuccess) return;

        const timerId = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    handleExpire();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, bookingSuccess]);

    const handleExpire = async () => {
        toast.error("Your transaction has been cancelled because the transaction time expired. Please try again.");
        try {
            // Optimistically update UI
            navigate('/movies');
            // The backend cleanup job will also handle this, or we can explicitly call an API if we want
        } catch(e) {}
    };

    const handlePayAtCounter = async () => {
        setProcessing(true);
        try {
            const res = await api.post('/bookings', { transactionId });
            if (res.data.success) {
                setBookingSuccess(res.data.data);
                toast.success("Booking confirmed!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Payment processing failed");
            if (error.response?.data?.message.includes("expired")) {
                navigate('/movies');
            }
        }
        setProcessing(false);
    };

    const handleDownloadPDF = async () => {
        try {
            const res = await api.get(`/bookings/${bookingSuccess._id}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Receipt_${bookingSuccess.bookingCode}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            toast.error("Failed to download receipt");
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (loading) return <div className="text-center text-white py-20 text-xl animate-pulse">Loading transaction...</div>;

    if (bookingSuccess) {
        return (
            <div className="max-w-2xl mx-auto bg-secondary p-8 rounded-xl shadow-2xl text-center border-t-8 border-green-500 mt-10">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
                <h1 className="text-4xl font-bold mb-2">🎉 Booking Confirmed!</h1>
                <p className="text-gray-400 mb-8">Your tickets have been successfully booked.</p>
                
                <div className="bg-dark p-6 rounded-lg text-left mb-8 shadow-inner border border-gray-800">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-4">
                        <div>
                            <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Booking Code</p>
                            <p className="text-2xl font-bold text-primary tracking-widest">{bookingSuccess.bookingCode}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Status</p>
                            <p className="text-yellow-500 font-bold">Pay at Counter</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-400">Movie</p>
                            <p className="font-bold">{transaction.showId.movieId.title}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Theatre</p>
                            <p className="font-bold">{transaction.showId.theatreId.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Date & Time</p>
                            <p className="font-bold">{new Date(transaction.showId.date).toLocaleDateString()} | {transaction.showId.startTime}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Seats</p>
                            <p className="font-bold">{transaction.seats.map(s => s.seatNumber).join(', ')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Amount</p>
                            <p className="font-bold text-xl">Rs. {bookingSuccess.amount}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                    <button 
                        onClick={handleDownloadPDF}
                        className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition shadow-lg"
                    >
                        <Download size={20} />
                        <span>Download PDF</span>
                    </button>
                    <button 
                        onClick={() => navigate('/my-bookings')}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition"
                    >
                        View My Bookings
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="border border-gray-600 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-bold transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <div className={`mb-6 p-4 rounded-lg flex items-center justify-center space-x-3 text-xl font-bold shadow-lg border ${timeLeft <= 300 ? 'bg-red-900/50 border-red-500 text-red-500 animate-pulse' : 'bg-secondary border-gray-700 text-white'}`}>
                <Clock size={28} />
                <span>Complete your transaction in : {formatTime(timeLeft)}</span>
            </div>

            <div className="bg-secondary rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-800">
                <div className="md:w-1/3 bg-dark p-6 relative">
                    <img src={transaction.showId.movieId.poster} alt="Poster" className="w-full h-auto rounded-lg shadow-lg mb-4" />
                    <h3 className="text-xl font-bold mb-1 text-center">{transaction.showId.movieId.title}</h3>
                </div>
                <div className="md:w-2/3 p-8">
                    <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Payment Details</h2>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Theatre</span>
                            <span className="font-bold">{transaction.showId.theatreId.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Date & Time</span>
                            <span className="font-bold">{new Date(transaction.showId.date).toLocaleDateString()} | {transaction.showId.startTime}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Seats</span>
                            <span className="font-bold">{transaction.seats.map(s => s.seatNumber).join(', ')}</span>
                        </div>
                        <div className="border-t border-gray-700 pt-4 flex justify-between text-xl font-bold text-primary">
                            <span>Total Amount</span>
                            <span>Rs. {transaction.amount}</span>
                        </div>
                    </div>

                    <div className="bg-dark p-4 rounded-lg border border-gray-700 mb-8">
                        <p className="text-sm text-gray-400 mb-2 font-bold">PAYMENT OPTIONS</p>
                        <div className="flex items-center space-x-3 text-white bg-secondary p-3 rounded border border-primary">
                            <input type="radio" checked readOnly className="accent-primary w-5 h-5" />
                            <span className="font-medium">Pay at Counter</span>
                        </div>
                    </div>

                    <button 
                        onClick={handlePayAtCounter}
                        disabled={processing}
                        className={`w-full py-4 rounded-lg font-bold text-xl transition shadow-[0_4px_14px_0_rgba(229,9,20,0.39)] flex justify-center items-center space-x-2 ${processing ? 'bg-gray-600 cursor-wait text-gray-300' : 'bg-primary hover:bg-red-700 text-white'}`}
                    >
                        {processing ? <span>Processing...</span> : <span>PAY AT COUNTER</span>}
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-4">By proceeding, you agree to our Terms and Conditions.</p>
                </div>
            </div>
        </div>
    );
};

export default Payment;
