import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "./Navbar";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function House({
  isAuthed,
  setIsAuthed,
}: {
  isAuthed: boolean;
  setIsAuthed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [houses, setHouses] = useState<
    Array<{ name: string; location: string; icon_url: string }>
  >([]);

  // Check session on mount and listen for auth changes
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsAuthed(true);
      else setIsAuthed(false);
    });
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthed(!!session);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setIsAuthed]);

  // Fetch houses from database
  useEffect(() => {
    if (!isAuthed) return; // Don't fetch if not authenticated
    const fetchHouses = async () => {
      const { data, error } = await supabase
        .from("houses")
        .select("name, location, icon_url");
      if (error) {
        console.error("Error fetching houses:", error);
      } else {
        setHouses(data || []);
      }
    };
    fetchHouses();
  }, [isAuthed]);

  // Sort houses alphabetically by name
  const sortedHouses = [...houses].sort((a, b) => a.name.localeCompare(b.name));

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthed(false);
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-black text-white p-4 md:p-8 flex items-center justify-center">
        <h2 className="text-xl">Please log in to view houses.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <Navbar isAuthed={isAuthed} onLogout={handleLogout} />
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-orange-400 text-center tracking-wide">
        Houses and Locations
      </h1>
      <div className="max-w-3xl mx-auto space-y-4">
        {sortedHouses.map((house, index) => (
          <div
            key={index}
            className="bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-lg flex justify-between items-center"
          >
            <div>
              <img
                src={`${house.icon_url}`}
                alt={`${house.name} icon`}
                className="w-8 h-8 object-cover rounded"
              />
              <h2 className="text-xl font-semibold text-orange-300">
                {house.name}
              </h2>
            </div>
            <div className="text-gray-200">{house.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
