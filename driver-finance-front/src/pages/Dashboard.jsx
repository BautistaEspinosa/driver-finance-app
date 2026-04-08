import { useEffect, useState } from "react";
import { getSummary, getShifts } from "../api/shiftApi";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [filter, setFilter] = useState("today");
  const [displayDate, setDisplayDate] = useState("");
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    console.log(" Tipo filtro:", filter);
    loadSummary(filter);
  }, [filter]);

  const getLastShiftDate = async () => {
    const shifts = await getShifts();

    console.log(" Shifts recibidos:", shifts);

    if (!shifts || shifts.length === 0) {
      console.warn(" No hay fechas registradas");
      return null;
    }

    const lastDate = shifts[0].shiftDate;

    console.log("Última fecha:", lastDate);

    return lastDate;
  };

  const groupByDay = (shifts) => {
    console.log("Agrupando shifts:", shifts);

    const result = {};

    shifts.forEach((s) => {
      const net =
        Number(s.income) -
        Number(s.gas) -
        Number(s.otherExpenses);

      if (!result[s.shiftDate]) {
        result[s.shiftDate] = 0;
      }

      result[s.shiftDate] += net;
    });

    console.log(" Resultado agrupado:", result);

    return result;
  };

  const loadSummary = async (type) => {
    let params = "";
    let lastDate = null;

    if (type === "today" || type === "week") {
      lastDate = await getLastShiftDate();

      if (!lastDate) {
        setSummary(null);
        return;
      }
    }

    let from, to;

    if (type === "today") {
      from = lastDate;
      to = lastDate;

      params = `?from=${from}&to=${to}`;
      setDisplayDate(from);
    }

    if (type === "week") {
      const [y, m, d] = lastDate.split("-");
      const dateObj = new Date(y, m - 1, d);

      const firstDay = new Date(dateObj);
      firstDay.setDate(dateObj.getDate() - dateObj.getDay());

      from = firstDay.toLocaleDateString("en-CA");
      to = lastDate;

      params = `?from=${from}&to=${to}`;
      setDisplayDate(`${from} - ${to}`);
    }

    if (type === "all") {
      setDisplayDate("Todos los registros");
    }

    console.log(" Params:", params);

    // SUMMARY
    const summaryRes = await getSummary(params);
    setSummary(summaryRes.data);

    // SHIFTS
    const shifts = await getShifts();

    let filtered = [];

    if (type === "today") {
      filtered = shifts.filter((s) => s.shiftDate === lastDate);
    }

    if (type === "week") {
      filtered = shifts.filter((s) => {
        return s.shiftDate >= from && s.shiftDate <= to;
      });
    }

    if (type === "all") {
      filtered = shifts;
    }

    console.log("Filtrados:", filtered);

    const grouped = groupByDay(filtered);
    setGroupedData(grouped);
  };

  if (!summary) return <p>No hay datos aún</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1> Dashboard</h1>

      <div>
        <button onClick={() => setFilter("today")}>Hoy</button>
        <button onClick={() => setFilter("week")}>Semana</button>
        <button onClick={() => setFilter("all")}>Todo</button>
      </div>

      <h2>Ganancia neta</h2>
      <h1>${summary.netEarnings}</h1>

      <p>Periodo: {displayDate}</p>

      <p>Ingresos: ${summary.totalIncome}</p>
      <p>Gas: ${summary.totalGas}</p>
      <p>Otros: ${summary.totalOtherExpenses}</p>

      <h3>Ganancias por día</h3>

      {Object.keys(groupedData).length === 0 ? (
        <p>No hay datos</p>
      ) : (
        <ul>
          {Object.entries(groupedData).map(([date, total]) => (
            <li key={date}>
              {date}: ${total}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}