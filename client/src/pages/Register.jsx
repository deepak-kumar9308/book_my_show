import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.phone);
            toast.success('Registered successfully');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-8">
            <div className="bg-secondary p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            className="w-full bg-dark text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            className="w-full bg-dark text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1">Phone (Optional)</label>
                        <input 
                            type="text" 
                            name="phone"
                            className="w-full bg-dark text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            className="w-full bg-dark text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-2 rounded-md font-bold hover:bg-red-700 transition">
                        Register
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-4">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
