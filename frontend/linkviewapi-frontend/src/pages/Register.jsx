    import React, { useState } from 'react';
    import axios from 'axios';
    import { useNavigate, Link } from 'react-router-dom';


    export default function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    await axios.post('http://localhost:3000/api/user/register', form);
    navigate('/login');
    } catch (err) {
    setError(err.response?.data?.message || 'Registration failed');
    }
    };


    return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
    <form onSubmit={handleSubmit} autoComplete='off' className="flex flex-col gap-4">
    <input type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="border p-2 rounded" required />
    <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2 rounded" required />
    <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border p-2 rounded" required />
    {error && <p className="text-red-500 text-sm">{error}</p>}
    <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
    </form>
    <p className="text-center text-sm mt-3">
    Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
    </p>
    </div>
    );
    }