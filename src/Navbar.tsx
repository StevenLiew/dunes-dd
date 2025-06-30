import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location =
    typeof useLocation === "function" ? useLocation() : { pathname: "/" };
  return (
    <nav className="w-full bg-gray-950 border-b border-gray-800 mb-8">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
        <Link
          to="/"
          className={`text-lg font-bold tracking-wide transition-colors ${
            location.pathname === "/"
              ? "text-orange-400"
              : "text-gray-200 hover:text-orange-300"
          }`}
        >
          Home
        </Link>
        <Link
          to="/manage"
          className={`text-lg font-bold tracking-wide transition-colors ${
            location.pathname === "/manage"
              ? "text-orange-400"
              : "text-gray-200 hover:text-orange-300"
          }`}
        >
          Manage Map
        </Link>
        <Link
          to="/changelog"
          className={`text-lg font-bold tracking-wide transition-colors ${
            location.pathname === "/changelog"
              ? "text-orange-400"
              : "text-gray-200 hover:text-orange-300"
          }`}
        >
          Changelog
        </Link>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-gray-950 border-t border-gray-800 mt-12 py-6 text-center text-sm text-gray-400">
      All intellectual property and assets related to Dune Awakening game are
      reserved by{" "}
      <a
        href="https://www.funcom.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-orange-400 hover:text-orange-300"
      >
        Funcom
      </a>
      . This site is fan-made and not affiliated with Dune Awakening game, or
      Funcom.
    </footer>
  );
}
