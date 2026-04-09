import { useState, useEffect } from "react";

export default function ShiftForm({ onSubmit, loading, initialData }) {
  const [mode, setMode] = useState("test");

  const [shiftDate, setShiftDate] = useState("");
  const [income, setIncome] = useState("");
  const [gas, setGas] = useState("");
  const [otherExpenses, setOtherExpenses] = useState("");

useEffect(() => {
  if (initialData) {
    console.log("Cargando datos para editar:", initialData);

    setShiftDate(initialData.shiftDate || "");
    setIncome(initialData.income ?? "");
    setGas(initialData.gas ?? "");
    setOtherExpenses(initialData.otherExpenses ?? "");
  } else {
    setShiftDate(new Date().toLocaleDateString("en-CA"));
    setIncome("");
    setGas("");
    setOtherExpenses("");
  }
}, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      shiftDate:
        mode === "prod"
          ? new Date().toLocaleDateString("en-CA")
          : shiftDate,
      income: Number(income),
      gas: Number(gas),
      otherExpenses: Number(otherExpenses),
    };

    console.log("Payload:", payload, "Modo:", mode);

    onSubmit(payload);

if(!initialData){
  setIncome("");
      setGas("");
      setOtherExpenses("");

      if (mode === "prod") {
        setShiftDate(new Date().toLocaleDateString("en-CA"));
      }
  }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <div>
        <label>Modo:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="test">Pruebas</option>
          <option value="prod">Producción</option>
        </select>
      </div>

      {mode === "test" && (
        <input
          type="date"
          value={shiftDate ?? ""}
          onChange={(e) => setShiftDate(e.target.value)}
        />
      )}

      <input
        type="number"
        placeholder="Ingresos"
        value={income ?? ""}
        onChange={(e) => setIncome(e.target.value)}
      />

      <input
        type="number"
        placeholder="Gas"
        value={gas ?? ""}
        onChange={(e) => setGas(e.target.value)}
      />

      <input
        type="number"
        placeholder="Otros"
        value={otherExpenses ?? ""}
        onChange={(e) => setOtherExpenses(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar"}
      </button>

    </form>
  );
}