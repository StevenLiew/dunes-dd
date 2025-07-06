import { Link, useLocation } from "react-router-dom";

export default function Navbar({
  isAuthed,
  onLogout,
}: {
  isAuthed?: boolean;
  onLogout?: () => void;
}) {
  const location =
    typeof useLocation === "function" ? useLocation() : { pathname: "/" };
  return (
    <nav className="w-full bg-gray-950 border-b border-gray-800 mb-8">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side links */}
        <div className="flex items-center gap-6">
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
        {/* Right side Log Out */}
        {isAuthed && onLogout && (
          <span
            onClick={onLogout}
            className="cursor-pointer text-lg font-bold tracking-wide transition-colors hover:text-orange-300"
          >
            Log Out
          </span>
        )}
      </div>
    </nav>
  );
}
