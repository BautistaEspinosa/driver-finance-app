import { useState } from "react";
import ShiftForm from "../components/ShiftForm";
import { patchShift } from "../api/shiftApi";

export default function EditShift({ shift, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const buildPatchPayload = (original, updated) => {
    const payload = {};

    if (original.shiftDate !== updated.shiftDate) {
      payload.shiftDate = updated.shiftDate;
    }

    if (Number(original.income) !== Number(updated.income)) {
      payload.income = updated.income;
    }

    if (Number(original.gas) !== Number(updated.gas)) {
      payload.gas = updated.gas;
    }

    if (
      Number(original.otherExpenses) !== Number(updated.otherExpenses)
    ) {
      payload.otherExpenses = updated.otherExpenses;
    }

    console.log("PATCH payload generado:", payload);

    return payload;
  };

  const handleUpdate = async (data) => {
    console.log("Datos recibidos del form:", data);

    const patchPayload = buildPatchPayload(shift, data);

    if (Object.keys(patchPayload).length === 0) {
      console.warn("No hay cambios para actualizar");
      setMessage("No hiciste cambios");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await patchShift(shift.id, patchPayload);

      console.log("Respuesta PATCH:", res);

      if (res.success) {
        setMessage("Turno actualizado correctamente");
        onUpdated();
      } else {
        setMessage(res.error || "Error al actualizar");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error de conexión");
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

      <button
        onClick={() => {
          console.log("Cancelando edición");
          onUpdated();
        }}
        style={{ marginTop: "10px" }}
      >
        Cancelar
      </button>
    </div>
  );
}