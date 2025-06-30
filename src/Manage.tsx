import React, { useState } from "react";
import { Link } from "react-router-dom";
import App from "./App";
import { Footer } from "./Navbar";

const SITE_PASSWORD = import.meta.env.VITE_SITE_PASSWORD;

export default function Manage() {
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      setIsAuthed(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="bg-gray-900 border border-gray-700 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-orange-400 mb-4">
            Management Login
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors text-lg"
            />
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Sign In
            </button>
          </form>
          <div className="mt-8 flex justify-center">
            <Link to="/" className="text-orange-400 hover:underline">
              Back to Map
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If authed, show the full management UI (reuse App with viewOnly={false})
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <App viewOnly={false} />
    </div>
  );
}
