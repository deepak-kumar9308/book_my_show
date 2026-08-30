import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Film, User, LogOut, MapPin } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-secondary text-white py-4 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary">
                    <Film size={32} />
                    <span>CineTick</span>
                </Link>

                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/movies" className="hover:text-primary transition">Movies</Link>
                    <Link to="/theatres" className="hover:text-primary transition">Theatres</Link>
                    <div className="flex items-center space-x-1 text-gray-300">
                        <MapPin size={18} />
                        <select className="bg-transparent outline-none">
                            <option value="delhi" className="bg-secondary">Delhi</option>
                            <option value="mumbai" className="bg-secondary">Mumbai</option>
                            <option value="bengaluru" className="bg-secondary">Bengaluru</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/profile" className="flex items-center space-x-1 hover:text-primary transition">
                                <User size={20} />
                                <span>{user.name}</span>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-primary transition">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="hover:text-primary transition">Login</Link>
                            <Link to="/register" className="bg-primary px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
