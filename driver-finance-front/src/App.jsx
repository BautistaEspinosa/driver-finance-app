import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import CreateShift from "./pages/CreateShift";
import ShiftList from "./pages/ShiftList";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [refresh, setRefresh] = useState(0);

  const handleCreated = () => {
    console.log("Trigger refresh dashboard");
    setRefresh((prev) => prev + 1);
    setPage("dashboard");
  };

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>

      {/* NAVBAR */}
      <nav
        style={{
          display: "flex",
          gap: "10px",
          padding: "15px",
          background: "#222",
        }}
      >
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("create")}>Crear</button>
        <button onClick={() => setPage("list")}>Historial</button>
      </nav>

      {/* CONTENIDO */}
      <div style={{ padding: "20px" }}>
        {page === "dashboard" && <Dashboard refresh={refresh} />}
        {page === "create" && <CreateShift onCreated={handleCreated} />}
        {page === "list" && <ShiftList onDeleted={handleCreated} />}
      </div>
    </div>
  );
}