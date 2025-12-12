import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Home from "./screens/Home";
import Chat from "./screens/Chat";
import Meds from "./screens/Meds";
import Caretaker from "./screens/Caretaker";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-8 bg-gray-50 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/medications" element={<Meds />} />
            <Route path="/caretaker" element={<Caretaker />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;




