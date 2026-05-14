import { useEffect, useState } from "react";
import { getSummary, getShifts } from "../api/shiftApi";
import { formatMoney } from "../utils/format";
import GoalProgress from "../components/GoalProgress";

export default function Dashboard({ refresh }) {
  const [summary, setSummary] = useState(null);
  const [grouped, setGrouped] = useState({});
  const [filter, setFilter]   = useState("today");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, [filter, refresh]);

  const buildParams = () => {
    const today = new Date().toISOString().split("T")[0];

    if (filter === "today") {
      return `?from=${today}&to=${today}`;
    }

    if (filter === "week") {
      const d     = new Date(today);
      const first = new Date(d);
      first.setDate(d.getDate() - d.getDay());
      const from = first.toISOString().split("T")[0];
      return `?from=${from}&to=${today}`;
    }

    return "";
  };

  const load = async () => {
    setLoading(true);
    setError("");

    const params = buildParams();

    let summaryData = null;
    let shiftsData = [];

    // 🔹 summary = crítico
    try {
      summaryData = await getSummary(params);
    } catch (e) {
      console.error("Error summary", e);
      setError("No se pudo cargar el resumen.");
    }

    // 🔹 shifts = opcional (no rompe la app)
    try {
      shiftsData = await getShifts(params);
    } catch (e) {
      console.error("Error shifts", e);
    }

    setSummary(summaryData);
    setGrouped(groupByDay(shiftsData));

    setLoading(false);
  };

  const groupByDay = (shifts) =>
    shifts.reduce((acc, s) => {
      acc[s.shiftDate] =
        (acc[s.shiftDate] || 0) + Number(s.netEarnings);
      return acc;
    }, {});

  return (
    <div>
      <h1>Dashboard</h1>

      <GoalProgress />

      <div style={{ display: "flex", gap: "8px", margin: "16px 0" }}>
        <button onClick={() => setFilter("today")}  disabled={filter === "today"}>Hoy</button>
        <button onClick={() => setFilter("week")}   disabled={filter === "week"}>Semana</button>
        <button onClick={() => setFilter("all")}    disabled={filter === "all"}>Todo</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading && <p>Cargando...</p>}

      {!loading && !summary && !error && (
        <p>No hay datos para el período seleccionado.</p>
      )}

      {!loading && summary && (
        <>
          <h2>Neto: {formatMoney(summary.netEarnings)}</h2>

          <h3>Ingresos por día</h3>

          {Object.keys(grouped).length === 0 ? (
            <p>No hay registros</p>
          ) : (
            <ul>
              {Object.entries(grouped)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([date, total]) => (
                  <li key={date}>
                    {date} — {formatMoney(total)}
                  </li>
                ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}