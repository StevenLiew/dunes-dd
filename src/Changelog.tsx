import { Link } from "react-router-dom";
import Navbar, { Footer } from "./Navbar";

const changelog = [
  {
    version: "v0.3",
    changes: [
      "Added Changelog",
      "Added Management page",
      "Added top navbar",
      'Root page is "View-only"',
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
