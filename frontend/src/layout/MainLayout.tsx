import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-5 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-blue-600">JARVIS 3.0</h1>

        <nav className="flex flex-col gap-3">
          <Link className="text-lg hover:text-blue-500" to="/">Home</Link>
          <Link className="text-lg hover:text-blue-500" to="/chat">Chat</Link>
          <Link className="text-lg hover:text-blue-500" to="/meds">Medications</Link>
          <Link className="text-lg hover:text-blue-500" to="/caretaker">Caretaker</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}
