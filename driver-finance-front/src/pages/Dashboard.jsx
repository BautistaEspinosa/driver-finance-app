import { useEffect, useState } from "react";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/shifts/summary")
      .then(res => res.json())
      .then(data => setSummary(data.data));
  }, []);

  if (!summary) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>💸 Resumen</h1>

      <h2>Ganancia neta</h2>
      <h1>${summary.netEarnings}</h1>

      <p>Ingresos: ${summary.totalIncome}</p>
      <p>Gas: ${summary.totalGas}</p>
      <p>Otros: ${summary.totalOtherExpenses}</p>
    </div>
  );
}