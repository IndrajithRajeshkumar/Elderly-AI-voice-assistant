import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path: string) =>
    `block py-3 px-4 rounded-md font-medium text-lg ${
      location.pathname === path
        ? "bg-blue-100 text-blue-700"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="w-64 min-h-screen border-r bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">JARVIS 3.0</h1>

      <nav className="flex flex-col gap-3">
        <Link className={linkClass("/")} to="/">Home</Link>
        <Link className={linkClass("/chat")} to="/chat">Chat</Link>
        <Link className={linkClass("/medications")} to="/medications">Medications</Link>
        <Link className={linkClass("/caretaker")} to="/caretaker">Caretaker</Link>
      </nav>
    </div>
  );
}

