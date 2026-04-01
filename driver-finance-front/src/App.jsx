import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateShift from "./pages/CreateShift";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "10px" }}>
        <Link to="/">Resumen</Link> |{" "}
        <Link to="/create">Registrar</Link>
      </div>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateShift />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;