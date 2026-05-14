// goalCalculations.js

export const calculateNet = ({
  income,
  gas,
  otherExpenses,
}) => {
  return (
    Number(income || 0) -
    Number(gas || 0) -
    Number(otherExpenses || 0)
  );
};

export const calculateCurrentProgress = ({
  shiftClosed,
  accumulatedNet,
  net,
}) => {
  return shiftClosed
    ? Number(accumulatedNet || 0)
    : Number(accumulatedNet || 0) +
        Number(net || 0);
};

export const calculateRemainingGoal = ({
  goal,
  currentProgress,
}) => {
  if (!goal) return 0;

  return Math.max(
    Number(goal.amount || 0) -
      Number(currentProgress || 0),
    0
  );
};

export const calculateDaysRemaining = ({
  goal,
  today,
}) => {
  if (!goal) return 1;

  return Math.max(
    Math.ceil(
      (new Date(goal.endDate) -
        new Date(today)) /
        (1000 * 60 * 60 * 24)
    ) + 1,
    1
  );
};

export const calculateDailyGoal = ({
  remainingGoal,
  daysRemaining,
}) => {
  return (
    Number(remainingGoal || 0) /
    Number(daysRemaining || 1)
  );
};

export const calculateTrackStatus = ({
  net,
  dailyGoal,
}) => {
  return (
    Number(net || 0) >=
    Number(dailyGoal || 0)
  );
};

export const calculateAccumulatedNet = (
  shifts
) => {
  return shifts.reduce((acc, shift) => {
    return (
      acc +
      Number(shift.netEarnings || 0)
    );
  }, 0);
};