// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-xl text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Welcome to LinkPreview
        </h1>
        <p className="text-gray-700 mb-6">
          Generate previews for any URL instantly using your API key or login token.
        </p>

        {token || apiKey ? (
          <div className="flex flex-col gap-4">
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/preview"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Generate Preview
            </Link>
            <Link
              to="/profile"
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              My Profile
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Link
              to="/login"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
