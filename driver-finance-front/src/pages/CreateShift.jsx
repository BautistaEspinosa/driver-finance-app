import { useState } from "react";

export default function CreateShift() {
  const [shiftDate, setShiftDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [income, setIncome] = useState("");
  const [gas, setGas] = useState("");
  const [otherExpenses, setOtherExpenses] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/shifts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shiftDate,
        income: Number(income),
        gas: Number(gas),
        otherExpenses: Number(otherExpenses),
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Turno guardado ✅");

      // limpiar formulario
      setIncome("");
      setGas("");
      setOtherExpenses("");
    } else {
      alert("Error: " + data.error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Registrar Turno</h1>

      <form onSubmit={handleSubmit}>
        {/* 📅 Fecha (solo para pruebas) */}
        <div>
          <label>Fecha:</label>
          <input
            type="date"
            value={shiftDate}
            onChange={(e) => setShiftDate(e.target.value)}
          />
        </div>

        <div>
          <label>Ingresos:</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </div>

        <div>
          <label>Gas:</label>
          <input
            type="number"
            value={gas}
            onChange={(e) => setGas(e.target.value)}
          />
        </div>

        <div>
          <label>Otros gastos:</label>
          <input
            type="number"
            value={otherExpenses}
            onChange={(e) => setOtherExpenses(e.target.value)}
          />
        </div>

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}
