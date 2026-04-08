import { useEffect, useState } from "react";
import { getShifts } from "../api/shiftApi";

export default function ShiftList() {
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    loadShifts();
  }, []);

  const loadShifts = async () => {
    console.log("Cargando historial...");

    const data = await getShifts();

    console.log("Historial shifts:", data);

    setShifts(data || []);
  };

  return (
    <div>
      <h1>Historial</h1>

      {shifts.length === 0 ? (
        <p>No hay registros</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Ingresos</th>
              <th>Gas</th>
              <th>Otros</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((s) => (
              <tr key={s.id}>
                <td>{s.shiftDate}</td>
                <td>{s.income}</td>
                <td>{s.gas}</td>
                <td>{s.otherExpenses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}