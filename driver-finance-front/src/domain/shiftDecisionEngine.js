export const getShiftStatus = ({
  income,
  dailyGoal,
  remainingGlobal,
}) => {
  if (!dailyGoal) {
    return {
      status: "no_goal",
      label: "No hay meta activa",
      color: "gray",
    };
  }

  // 🟢 ya cumpliste meta diaria
  if (income >= dailyGoal) {
    return {
      status: "done_today",
      label: "🟢 Ya cumpliste la meta diaria",
      color: "green",
    };
  }

  // 🟡 vas bien (70% o más)
  if (income >= dailyGoal * 0.7) {
    return {
      status: "good",
      label: "🟡 Vas bien",
      color: "orange",
    };
  }

  // 🔴 vas atrasado
  if (income < dailyGoal * 0.7) {
    return {
      status: "late",
      label: "🔴 Vas atrasado",
      color: "red",
    };
  }

  return {
    status: "unknown",
    label: "Sin estado",
    color: "gray",
  };
};