import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { useUser } from './context/UserContext';


export default function App() {
const { user } = useUser();


return (
<div className="min-h-screen">
<Navbar />
<main className="max-w-4xl mx-auto p-4">
<Routes>
<Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
</Routes>
</main>
</div>
);
}