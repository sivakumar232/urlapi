import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';


export default function Navbar() {
const { user, setUser } = useUser();
const navigate = useNavigate();


const handleLogout = () => {
setUser(null);
navigate('/login');
};


return (
<nav className="bg-white shadow p-4 flex justify-between items-center">
<h1 className="text-2xl font-bold text-blue-600">LinkPreview</h1>
<div className="flex gap-4 items-center">
{user ? (
<>
<span className="text-gray-700">Hi, {user.username}</span>
<button onClick={handleLogout} className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">Logout</button>
</>
) : (
<>
<Link to="/login" className="text-blue-600">Login</Link>
<Link to="/register" className="text-blue-600">Register</Link>
</>
)}
</div>
</nav>
);
}