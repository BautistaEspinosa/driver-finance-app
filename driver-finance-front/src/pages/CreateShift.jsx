import ShiftForm from "../components/ShiftForm";
import { createShift } from "../api/shiftApi";

export default function CreateShift() {
  const handleCreate = async (data) => {
    console.log("Enviando al backend:", data);

    const res = await createShift(data);

    console.log("Respuesta backend:", res);

    if (res.success) {
      console.log("Turno guardado correctamente");
      alert("Turno guardado!!");

      // TEMPORAL para debug
      window.location.reload();
    } else {
      console.error("Error:", res.error);
      alert(res.error);
    }
  };

  return (
    <div>
      <h1>Registrar turno</h1>
      <ShiftForm onSubmit={handleCreate} />
    </div>
  );
}