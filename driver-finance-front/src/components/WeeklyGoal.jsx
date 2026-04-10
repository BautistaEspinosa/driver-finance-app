import { useEffect, useState } from "react";
import { getWeeklyGoal, createWeeklyGoal } from "../api/shiftApi";

export default function WeeklyGoal() {
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGoal();
  }, []);

  const loadGoal = async () => {
    try {
      const res = await getWeeklyGoal();

      if (res.success) {
        setGoal(res.data);
      } else if (res.error === "No hay meta activa") {
        setGoal(null); // estado normal
      } else {
        setError(res.error); // errores reales
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!amount || Number(amount) <= 0) {
      setError("Ingresa un monto válido");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await createWeeklyGoal({
        amount: Number(amount),
      });

      if (res.success) {
        setAmount("");
        loadGoal(); // 🔥 recargar meta
      } else {
        setError(res.error);
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const formatMoney = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);

  if (loading) return <p>Cargando meta semanal...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // 🔥 CASO 1: NO HAY META
  if (!goal) {
    return (
      <div>
        <h2>Meta semanal</h2>

        <input
          type="number"
          placeholder="Ej. 5000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={handleCreate} disabled={saving}>
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    );
  }

  // 🔥 CASO 2: SÍ HAY META

  const percentage = Number(goal.percentage);
  const progressWidth = Math.min(percentage, 100);
  const remaining = Math.max(Number(goal.remaining), 0);

  let progressColor = "red";
  if (percentage >= 50 && percentage < 80) progressColor = "orange";
  if (percentage >= 80) progressColor = "green";

  return (
    <div>
      <h2>Meta semanal</h2>

      <p>Meta: {formatMoney(goal.amount)}</p>
      <p>Llevas: {formatMoney(goal.current)}</p>
      <p>Te falta: {formatMoney(remaining)}</p>
      <p>Progreso: {percentage.toFixed(0)}%</p>

      <div
        style={{
          width: "100%",
          height: "20px",
          background: "#ddd",
          borderRadius: "10px",
          overflow: "hidden",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            width: `${progressWidth}%`,
            height: "100%",
            background: progressColor,
            transition: "0.3s",
          }}
        />
      </div>
    </div>
  );
}