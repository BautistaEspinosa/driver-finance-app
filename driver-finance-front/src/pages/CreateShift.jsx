import { useState } from "react";
import ShiftForm from "../components/ShiftForm";
import { createShift } from "../api/shiftApi";

export default function CreateShift({ onCreated }) {
  const [message, setMessage]   = useState("");
  const [isError, setIsError]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleCreate = async (data) => {
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      await createShift(data);
      setMessage("Turno guardado correctamente");
      // MEJORA: console.log eliminado — no debe haber logs de payload
      // con datos financieros en producción.
      onCreated();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <h1>Registrar turno</h1>

      {/* MEJORA: color diferenciado según éxito o error */}
      {message && (
        <p style={{ color: isError ? "red" : "green" }}>
          {message}
        </p>
      )}

      <ShiftForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
}