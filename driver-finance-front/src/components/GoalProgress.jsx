import { useEffect, useState } from "react";
import { getGoalProgress } from "../api/shiftApi";
import { formatMoney } from "../utils/format";

export default function GoalProgress() {
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getGoalProgress();
      setGoal(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando meta...</p>;

  if (!goal) {
    return (
      <div>
        <h3>🎯 Meta</h3>
        <p>No hay meta activa</p>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>🎯 Meta del período</h3>

      <p>Total: {formatMoney(goal.targetAmount)}</p>
      <p>Llevas: {formatMoney(goal.current)}</p>
      <p>Faltan: {formatMoney(goal.remaining)}</p>
      <p>Días restantes: {goal.daysLeft}</p>

      <hr />

      <p>Promedio diario: {formatMoney(goal.avgPerDay)}</p>
      <p>Requerido por día: {formatMoney(goal.requiredPerDay)}</p>
    </div>
  );
}