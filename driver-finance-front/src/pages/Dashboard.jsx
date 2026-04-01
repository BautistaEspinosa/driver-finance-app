import { useEffect, useState } from "react";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [filter, setFilter] = useState("today");
  const [displayDate, setDisplayDate] = useState(""); // 🔥 NUEVO

  useEffect(() => {
    loadSummary(filter);
  }, [filter]);

  const format = (d) => {
    return d.toLocaleDateString("en-CA");
  };

  // 🔥 Obtener la última fecha registrada
  const getLastShiftDate = async () => {
    const res = await fetch("http://localhost:8080/api/shifts");
    const data = await res.json();

    const shifts = data.data;

    if (!shifts || shifts.length === 0) return null;

    return shifts[0].shiftDate;
  };

  const loadSummary = async (type) => {
    let url = "http://localhost:8080/api/shifts/summary";

    let today;

    if (type === "today" || type === "week") {
      const lastDate = await getLastShiftDate();

      if (!lastDate) {
        setSummary(null);
        return;
      }

      today = new Date(lastDate);
    }

    if (type === "today") {
      const t = format(today);
      url += `?from=${t}&to=${t}`;
      setDisplayDate(t); // 🔥
    }

    if (type === "week") {
      const firstDay = new Date(today);
      firstDay.setDate(today.getDate() - today.getDay());

      const from = format(firstDay);
      const to = format(today);

      url += `?from=${from}&to=${to}`;
      setDisplayDate(`${from} - ${to}`); // 🔥
    }

    if (type === "all") {
      setDisplayDate("Todos los registros"); // 🔥
    }

    console.log("URL:", url);

    const res = await fetch(url);
    const data = await res.json();

    setSummary(data.data);
  };

  if (!summary) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>💸 Resumen</h1>

      {/* 🔘 Filtros */}
      <div>
        <button onClick={() => setFilter("today")}>Hoy</button>
        <button onClick={() => setFilter("week")}>Semana</button>
        <button onClick={() => setFilter("all")}>Todo</button>
      </div>

      <h2>Ganancia neta</h2>
      <h1>${summary.netEarnings}</h1>

      {/* 🔥 AQUÍ YA FUNCIONA */}
      <p>Día: {displayDate}</p>

      <p>Ingresos: ${summary.totalIncome}</p>
      <p>Gas: ${summary.totalGas}</p>
      <p>Otros: ${summary.totalOtherExpenses}</p>
    </div>
  );
}