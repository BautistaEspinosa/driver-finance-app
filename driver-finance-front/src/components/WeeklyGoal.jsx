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
      const data = await getWeeklyGoal();

      if (!data || data.amount <= 0) {
        setGoal(null);
      } else {
        setGoal(data);
      }

      setError("");
    } catch (err) {
      setError("Error de conexión");
      setGoal(null);
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
      await createWeeklyGoal({ amount: Number(amount) });
      setAmount("");
      await loadGoal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatMoney = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value || 0);

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Meta semanal</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!goal ? (
        <>
          <input
            type="number"
            placeholder="Ej. 5000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={handleCreate} disabled={saving}>
            Guardar
          </button>
        </>
      ) : (
        <>
          <p>Meta: {formatMoney(goal.amount)}</p>
          <p>Llevas: {formatMoney(goal.current)}</p>
          <p>Te falta: {formatMoney(goal.remaining)}</p>
          <p>Progreso: {goal.percentage.toFixed(0)}%</p>
        </>
      )}
    </div>
  );
}