import React, { useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Get JWT token

      if (!token) {
        setError('You must be logged in to generate previews');
        return;
      }

      const res = await axios.get('http://localhost:3000/api/user/previewurl', { 
        params: { url },
        headers: {
          Authorization: `Bearer ${token}`, // attach JWT token
        },
      });

      setPreview(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not fetch preview');
      setPreview(null);// Get JWT token

    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Generate Link Preview</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input 
          type="url" 
          placeholder="Enter website URL" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          className="border flex-1 p-2 rounded" 
          required 
        />
        <button className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">Preview</button>
      </form>

      {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

      {preview && (
        <div className="border rounded p-4">
          {preview.image && <img src={preview.image} alt="preview" className="w-full h-48 object-cover rounded mb-3" />}
          <h3 className="text-xl font-semibold">{preview.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{preview.description}</p>
          <a href={preview.url} target="_blank" rel="noreferrer" className="text-blue-600 mt-2 inline-block">
            Visit Site →
          </a>
                   <pre className="mt-4 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {JSON.stringify(preview, null, 2)}
          </pre>
        </div>
      )}

    </div>
  );
}
