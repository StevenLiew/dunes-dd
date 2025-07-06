import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import App from "./App";
import Footer from "./Footer";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Manage({
  isAuthed,
  setIsAuthed,
}: {
  isAuthed: boolean;
  setIsAuthed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const defaultEmail = import.meta.env.VITE_LOGIN_EMAIL || "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Check Supabase session on mount to set isAuthed
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsAuthed(true);
      else setIsAuthed(false);
    });
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthed(!!session);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setIsAuthed]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: defaultEmail,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setIsAuthed(true);
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
              required
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
  return <App viewOnly={false} isAuthed={isAuthed} setIsAuthed={setIsAuthed} />;
}
