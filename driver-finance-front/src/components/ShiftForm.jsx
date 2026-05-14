import { useState, useEffect } from "react";

export default function ShiftForm({ onSubmit, loading, initialData }) {
  const [shiftDate, setShiftDate]         = useState("");
  const [income, setIncome]               = useState("");
  const [gas, setGas]                     = useState("");
  const [otherExpenses, setOtherExpenses] = useState("");

  useEffect(() => {
    if (initialData) {
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
      shiftDate,
      income:        Number(income),
      gas:           Number(gas),
      otherExpenses: Number(otherExpenses),
    };

    onSubmit(payload);

    if (!initialData) {
      setIncome("");
      setGas("");
      setOtherExpenses("");
      setShiftDate(new Date().toLocaleDateString("en-CA"));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div>
        <label htmlFor="shift-date">Fecha del turno</label>
        <input
          id="shift-date"
          type="date"
          value={shiftDate}
          onChange={(e) => setShiftDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="income">Ingresos</label>
        <input
          id="income"
          type="number"
          placeholder="Ingresos"
          value={income ?? ""}
          min={0}
          step="0.01"
          onChange={(e) => setIncome(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="gas">Gas</label>
        <input
          id="gas"
          type="number"
          placeholder="Gas"
          value={gas ?? ""}
          min={0}
          step="0.01"
          onChange={(e) => setGas(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="other">Otros gastos</label>
        <input
          id="other"
          type="number"
          placeholder="Otros gastos"
          value={otherExpenses ?? ""}
          min={0}
          step="0.01"
          onChange={(e) => setOtherExpenses(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}