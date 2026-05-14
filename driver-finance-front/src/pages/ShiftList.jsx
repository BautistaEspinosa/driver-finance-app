import { useEffect, useState } from "react";
import { getShifts, deleteShift, patchShift } from "../api/shiftApi";
import { formatMoney } from "../utils/format";
import ShiftForm from "../components/ShiftForm";

export default function ShiftList({ onChange }) {
  const [shifts, setShifts]   = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  // MEJORA: estado de error para mostrar al usuario si loadShifts falla.
  const [error, setError]     = useState("");
  // MEJORA: estado para confirmar borrado sin usar window.confirm.
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    loadShifts();
  }, []);

  // MEJORA: loadShifts ahora maneja errores — antes dejaba la lista vacía
  // sin ningún feedback visible al usuario.
  const loadShifts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getShifts();
      setShifts(data || []);
    } catch {
      setError("Error al cargar los turnos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteShift(pendingDelete);
      setPendingDelete(null);
      await loadShifts();
      onChange?.();
    } catch {
      setError("No se pudo eliminar el turno.");
      setPendingDelete(null);
    }
  };

  const handleUpdate = async (data) => {
    const payload = buildPatchPayload(editing, data);

    if (Object.keys(payload).length === 0) {
      // MEJORA: alert() reemplazado por mensaje en estado — sin bloqueo de UI.
      setError("No hiciste cambios.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await patchShift(editing.id, payload);
      setEditing(null);
      await loadShifts();
      onChange?.();
    } catch (err) {
      setError(err.message || "Error al actualizar.");
    } finally {
      setLoading(false);
    }
  };

  const buildPatchPayload = (original, updated) => {
    const payload = {};
    if (original.shiftDate !== updated.shiftDate)               payload.shiftDate = updated.shiftDate;
    if (Number(original.income) !== Number(updated.income))     payload.income = updated.income;
    if (Number(original.gas) !== Number(updated.gas))           payload.gas = updated.gas;
    if (Number(original.otherExpenses) !== Number(updated.otherExpenses)) payload.otherExpenses = updated.otherExpenses;
    return payload;
  };

  if (editing) {
    return (
      <div>
        <h2>Editar turno</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ShiftForm initialData={editing} onSubmit={handleUpdate} loading={loading} />
        <button onClick={() => { setEditing(null); setError(""); }}>Cancelar</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Historial</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* MEJORA: modal de confirmación propio en vez de window.confirm */}
      {pendingDelete && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100,
        }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "8px", maxWidth: "320px" }}>
            <p>¿Eliminar este turno? Esta acción no se puede deshacer.</p>
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button onClick={confirmDelete}>Sí, eliminar</button>
              <button onClick={() => setPendingDelete(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {loading && <p>Cargando...</p>}

      {!loading && shifts.length === 0 && <p>No hay registros</p>}

      {!loading && shifts.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Ingresos</th>
              <th>Gas</th>
              <th>Otros</th>
              <th>Neto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((s) => (
              <tr key={s.id}>
                <td>{s.shiftDate}</td>
                {/* MEJORA: usar formatMoney del utilitario centralizado */}
                <td>{formatMoney(s.income)}</td>
                <td>{formatMoney(s.gas)}</td>
                <td>{formatMoney(s.otherExpenses)}</td>
                <td>{formatMoney(s.netEarnings)}</td>
                <td>
                  <button onClick={() => setEditing(s)}>Editar</button>
                  {/* MEJORA: setPendingDelete en vez de window.confirm */}
                  <button onClick={() => setPendingDelete(s.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}