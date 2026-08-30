import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import Theatres from './pages/Theatres';
import SeatSelection from './pages/SeatSelection';
import Payment from './pages/Payment';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-dark text-light font-sans">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/theatres" element={<Theatres />} />
            <Route path="/seats/:showId" element={<SeatSelection />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/payment/:transactionId" element={<Payment />} />
              <Route path="/my-bookings" element={<MyBookings />} />
            </Route>
          </Routes>
        </main>
        <footer className="bg-secondary py-6 text-center text-gray-400 mt-auto">
          <p>&copy; {new Date().getFullYear()} CineTick. All rights reserved.</p>
        </footer>
        <ToastContainer theme="dark" position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
