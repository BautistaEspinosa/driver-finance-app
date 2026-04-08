import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import CreateShift from "./pages/CreateShift";
import ShiftList from "./pages/ShiftList";

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div>
      <nav>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("create")}>Crear</button>
        <button onClick={() => setPage("list")}>Historial</button>
      </nav>

      {page === "dashboard" && <Dashboard />}
      {page === "create" && <CreateShift />}
      {page === "list" && <ShiftList />}
    </div>
  );
}