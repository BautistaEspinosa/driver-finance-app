import { useState } from "react";
import DailyShift from "./pages/DailyShift";
import ShiftList from "./pages/ShiftList";

export default function App() {
  const [page, setPage] = useState("today");

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", background: "#f5f5f5" }}>

      <nav style={{ display: "flex", gap: 10, padding: 15, background: "#222" }}>
        <button onClick={() => setPage("today")}>Hoy</button>
        <button onClick={() => setPage("history")}>Historial</button>
      </nav>

      <div style={{ padding: 20 }}>
        {page === "today" && <DailyShift />}
        {page === "history" && <ShiftList />}
      </div>

    </div>
  );
}