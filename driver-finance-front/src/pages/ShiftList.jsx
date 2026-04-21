import { useEffect, useState } from "react";
import { getShifts, deleteShift } from "../api/shiftApi";
import EditShift from "./EditShift";

export default function ShiftList({ onDeleted }) {
  const [shifts, setShifts] = useState([]);
  const [editingShift, setEditingShift] = useState(null);

  useEffect(() => {
    loadShifts();
  }, []);

  const loadShifts = async () => {
    const data = await getShifts();
    setShifts(data || []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar turno?")) return;

    try {
      await deleteShift(id);
      await loadShifts();
      onDeleted?.();
    } catch (error) {
      alert(error.message);
    }
  };

  if (editingShift) {
    return (
      <EditShift
        shift={editingShift}
        onUpdated={() => {
          setEditingShift(null);
          loadShifts();
          onDeleted?.();
        }}
      />
    );
  }

  return (
    <div>
      <h1>Historial</h1>

      {shifts.length === 0 ? (
        <p>No hay registros</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Ingresos</th>
              <th>Gas</th>
              <th>Otros</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {shifts.map((s) => (
              <tr key={s.id}>
                <td>{s.shiftDate}</td>
                <td>${s.income}</td>
                <td>${s.gas}</td>
                <td>${s.otherExpenses}</td>
                <td>
                  <button onClick={() => setEditingShift(s)}>
                    Editar
                  </button>

                  <button onClick={() => handleDelete(s.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}