import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Changelog from "./Changelog.tsx";
import Manage from "./Manage";

function MainLayout() {
  const [isAuthed, setIsAuthed] = useState(false);
  return (
    <BrowserRouter>
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
          path="/manage"
          element={<Manage isAuthed={isAuthed} setIsAuthed={setIsAuthed} />}
        />
        <Route
          path="/changelog"
          element={<Changelog isAuthed={isAuthed} setIsAuthed={setIsAuthed} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainLayout />
  </StrictMode>
);
