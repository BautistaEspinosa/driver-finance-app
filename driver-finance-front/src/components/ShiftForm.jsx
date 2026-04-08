import { useState } from "react";

export default function ShiftForm({ onSubmit }) {
  const [mode, setMode] = useState("test");

  const [shiftDate, setShiftDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [income, setIncome] = useState("");
  const [gas, setGas] = useState("");
  const [otherExpenses, setOtherExpenses] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      shiftDate:
        mode === "prod"
          ? new Date().toLocaleDateString("en-CA") // automático
          : shiftDate, // manual

      income: Number(income),
      gas: Number(gas),
      otherExpenses: Number(otherExpenses),
    };

    console.log("📤 Payload:", payload);

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Selector de modo */}
      <div>
        <label>Modo:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="test">🧪 Pruebas</option>
          <option value="prod">🚀 Producción</option>
        </select>
      </div>

      {/* Solo mostrar fecha en modo test */}
      {mode === "test" && (
        <div>
          <label>Fecha:</label>
          <input
            type="date"
            value={shiftDate}
            onChange={(e) => setShiftDate(e.target.value)}
          />
        </div>
      )}

      <input
        type="number"
        placeholder="Ingresos"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
      />

      <input
        type="number"
        placeholder="Gas"
        value={gas}
        onChange={(e) => setGas(e.target.value)}
      />

      <input
        type="number"
        placeholder="Otros"
        value={otherExpenses}
        onChange={(e) => setOtherExpenses(e.target.value)}
      />

      <button type="submit">Guardar</button>
    </form>
  );
}