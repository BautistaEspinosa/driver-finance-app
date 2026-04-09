import { useState } from "react";
import ShiftForm from "../components/ShiftForm";
import { createShift } from "../api/shiftApi";

export default function CreateShift({ onCreated }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data) => {
    console.log("Enviando al backend:", data);

    setLoading(true);
    setMessage("");

    try {
      const res = await createShift(data);

      console.log("Respuesta backend:", res);

      if (res.success) {
        console.log("Turno guardado correctamente");

        setMessage("Turno guardado correctamente");

        console.log("Creado → notificando dashboard");
        onCreated();
      } else {
        console.error("Error:", res.error);
        setMessage(res.error || "Error al guardar");
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setMessage("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <h1>Registrar turno</h1>

      {message && (
        <p style={{ background: "#e0ffe0", padding: "10px", borderRadius: "5px" }}>
          {message}
        </p>
      )}

      <ShiftForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
}