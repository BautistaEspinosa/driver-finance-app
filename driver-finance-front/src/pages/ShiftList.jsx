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
    console.log("Cargando historial...");

    const data = await getShifts();

    console.log("Historial:", data);

    setShifts(data || []);
  };

  const handleDelete = async (id) => {
    console.log("Click eliminar:", id);

    const confirmDelete = window.confirm("¿Eliminar turno?");

    if (!confirmDelete) {
      console.log("Cancelado");
      return;
    }

    const res = await deleteShift(id);

    if (res.success) {
      console.log("Eliminado correctamente");

      await loadShifts();

      if (onDeleted) {
        console.log("Notificando refresh dashboard");
        onDeleted();
      }
    } else {
      console.error("Error al eliminar:", res.error);
      alert(res.error);
    }
  };

  if (editingShift) {
    console.log("Modo edición activo:", editingShift);

    return (
      <EditShift
        shift={editingShift}
        onUpdated={() => {
          console.log("Update completado → regresando a lista");

          setEditingShift(null); // regresar a lista
          loadShifts();

          if (onDeleted) {
            onDeleted(); // refrescar dashboard
          }
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
        <table style={table}>
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

const table = {
  width: "100%",
  background: "white",
  borderRadius: "10px",
  overflow: "hidden",
};