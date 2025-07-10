import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Changelog from "./Changelog";
import Manage from "./Manage";
import House from "./House";
import Footer from "./Footer.tsx";

function MainLayout() {
  const [isAuthed, setIsAuthed] = useState(false);
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-black">
        {/* Main content area fills available space */}
        <div className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <App
                  viewOnly={true}
                  isAuthed={isAuthed}
                  setIsAuthed={setIsAuthed}
                />
              }
            />
            <Route
              path="/houses"
              element={<House isAuthed={isAuthed} setIsAuthed={setIsAuthed} />}
            />
            <Route
              path="/manage"
              element={<Manage isAuthed={isAuthed} setIsAuthed={setIsAuthed} />}
            />
            <Route
              path="/changelog"
              element={
                <Changelog isAuthed={isAuthed} setIsAuthed={setIsAuthed} />
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainLayout />
  </StrictMode>
);
