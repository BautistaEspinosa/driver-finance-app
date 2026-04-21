import { useEffect, useState } from "react";
import { getSummary, getShifts } from "../api/shiftApi";
import DailyGoal from "../components/DailyGoal";
import WeeklyGoal from "../components/WeeklyGoal";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [filter, setFilter] = useState("today");
  const [displayDate, setDisplayDate] = useState("");
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    console.log("Tipo filtro:", filter);
    loadSummary(filter);
  }, [filter]);

  const getLastShiftDate = async () => {
    const shifts = await getShifts();

    console.log("Shifts recibidos:", shifts);

    if (!shifts || shifts.length === 0) {
      console.warn("No hay fechas registradas");
      return null;
    }

    // ✅ Ordenamos por fecha DESC para asegurar el último
    const sorted = [...shifts].sort((a, b) =>
      b.shiftDate.localeCompare(a.shiftDate)
    );

    return sorted[0].shiftDate;
  };

  const groupByDay = (shifts) => {
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

    return result;
  };

  const loadSummary = async (type) => {
    try {
      let params = "";
      let lastDate = null;

      if (type === "today" || type === "week") {
        lastDate = await getLastShiftDate();

        if (!lastDate) {
          setSummary(null);
          setGroupedData({});
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

      // ✅ YA NO .data.data
      const summaryData = await getSummary(params);
      setSummary(summaryData);

      const shifts = await getShifts();

      let filtered = [];

      if (type === "today") {
        filtered = shifts.filter((s) => s.shiftDate === lastDate);
      }

      if (type === "week") {
        filtered = shifts.filter(
          (s) => s.shiftDate >= from && s.shiftDate <= to
        );
      }

      if (type === "all") {
        filtered = shifts;
      }

      setGroupedData(groupByDay(filtered));

    } catch (error) {
      console.error("Error cargando summary:", error);
      setSummary(null);
      setGroupedData({});
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={card}>
          <DailyGoal />
        </div>

        <div style={card}>
          <WeeklyGoal />
        </div>
      </div>

      {!summary ? (
        <p>No hay datos aún</p>
      ) : (
        <>
          <div style={{ marginBottom: "20px" }}>
            <button onClick={() => setFilter("today")}>Hoy</button>
            <button onClick={() => setFilter("week")}>Semana</button>
            <button onClick={() => setFilter("all")}>Todo</button>
          </div>

          <div style={cardMain}>
            <h2>Ganancia neta</h2>
            <h1>${summary.netEarnings}</h1>
            <p>Periodo: {displayDate}</p>
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <div style={card}>
              <h3>Ingresos</h3>
              <p>${summary.totalIncome}</p>
            </div>

            <div style={card}>
              <h3>Gas</h3>
              <p>${summary.totalGas}</p>
            </div>

            <div style={card}>
              <h3>Otros</h3>
              <p>${summary.totalOtherExpenses}</p>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3>Ganancias por día</h3>

            {Object.keys(groupedData).length === 0 ? (
              <p>No hay datos</p>
            ) : (
              <ul>
                {Object.entries(groupedData).map(([date, total]) => (
                  <li key={date}>
                    {date} - ${total}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const cardMain = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  marginBottom: "20px",
};

const card = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  flex: 1,
};