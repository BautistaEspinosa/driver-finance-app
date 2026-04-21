import { useState } from "react";
import ShiftForm from "../components/ShiftForm";
import { patchShift } from "../api/shiftApi";

export default function EditShift({ shift, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const buildPatchPayload = (original, updated) => {
    const payload = {};

    if (original.shiftDate !== updated.shiftDate)
      payload.shiftDate = updated.shiftDate;

    if (Number(original.income) !== Number(updated.income))
      payload.income = updated.income;

    if (Number(original.gas) !== Number(updated.gas))
      payload.gas = updated.gas;

    if (Number(original.otherExpenses) !== Number(updated.otherExpenses))
      payload.otherExpenses = updated.otherExpenses;

    return payload;
  };

  const handleUpdate = async (data) => {
    const patchPayload = buildPatchPayload(shift, data);

    if (Object.keys(patchPayload).length === 0) {
      setMessage("No hiciste cambios");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await patchShift(shift.id, patchPayload);

      setMessage("Turno actualizado correctamente");
      onUpdated();

    } catch (error) {
      setMessage(error.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Editar turno</h1>

      {message && <p>{message}</p>}

      <ShiftForm
        onSubmit={handleUpdate}
        loading={loading}
        initialData={shift}
      />

      <button onClick={onUpdated}>Cancelar</button>
    </div>
  );
}