import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const changelog = [
    {
    version: "v0.6",
    changes: [
      "Properly added authentication for management page",
      "Enabled RLS and added policies"
    ],
  },
  {
    version: "v0.5",
    changes: [
      "Fixed Coriolis Storm value not being saved (and hence displayed) correctly.",
    ],
  },
  {
    version: "v0.4",
    changes: ["Added Reset Map feature"],
  },
  {
    version: "v0.3",
    changes: [
      "Added Changelog page",
      "Added Management page",
      "Added navigation bar",
      'Default page now shows map in "View Only" mode',
      "Removed scrollbars from grid",
    ],
  },
  {
    version: "v0.2",
    changes: [
      'Now allows Fwd Bases to be created beyond "A" zone',
      "Fixed data issue with Varota house",
      "Added Houses Taligari, Spinette and Sor",
    ],
  },
  {
    version: "v0.1",
    changes: ["Launched map"],
  },
];

export default function Changelog() {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <Navbar />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-orange-400 text-center tracking-wide">
          Changelog
        </h1>
        <div className="space-y-8">
          {changelog.map((entry) => (
            <div
              key={entry.version}
              className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-bold text-orange-300 mb-2">
                {entry.version}
              </h2>
              <ul className="list-disc list-inside text-lg text-gray-200 pl-4">
                {entry.changes.map((change, idx) => (
                  <li key={idx}>{change}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Back to Map
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
