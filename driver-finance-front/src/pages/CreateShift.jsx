import { useState } from "react";

export default function CreateShift() {
  const [form, setForm] = useState({
    income: "",
    gas: "",
    otherExpenses: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    const today = new Date().toISOString().split("T")[0];

    await fetch("http://localhost:8080/api/shifts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        shiftDate: today,
        income: Number(form.income),
        gas: Number(form.gas),
        otherExpenses: Number(form.otherExpenses)
      })
    });

    alert("Turno guardado 🚀");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Registrar turno</h1>

      <input
        name="income"
        placeholder="Ingresos"
        type="number"
        onChange={handleChange}
      />

      <input
        name="gas"
        placeholder="Gasolina"
        type="number"
        onChange={handleChange}
      />

      <input
        name="otherExpenses"
        placeholder="Otros gastos"
        type="number"
        onChange={handleChange}
      />

      <br /><br />

      <button onClick={handleSubmit} style={{ fontSize: "20px" }}>
        GUARDAR 🚗
      </button>
    </div>
  );
}