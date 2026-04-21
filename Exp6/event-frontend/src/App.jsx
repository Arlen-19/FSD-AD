import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./components/Register";
import List from "./components/List";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-800 p-4 text-white flex justify-center gap-6">
        <Link to="/">Register</Link>
        <Link to="/list">View</Link>
      </nav>
      <div>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/list" element={<List />} />
        </Routes>
      </div>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
