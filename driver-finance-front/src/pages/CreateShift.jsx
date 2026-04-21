import { useState } from "react";
import ShiftForm from "../components/ShiftForm";
import { createShift } from "../api/shiftApi";

export default function CreateShift({ onCreated }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      await createShift(data);

      setMessage("Turno guardado correctamente");
      onCreated();

    } catch (error) {
      setMessage(error.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <h1>Registrar turno</h1>

      {message && <p>{message}</p>}

      <ShiftForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
}