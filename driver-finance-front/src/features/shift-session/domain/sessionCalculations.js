export const calculateCurrentNet = ({
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

export const calculateProjectedCurrent = ({
	goal,
	todayShift,
	currentNet,
}) => {
	if (!goal) return 0;

	if (!todayShift) {
		return Number(goal.current || 0) + currentNet;
	}

	return (
		Number(goal.current || 0) -
		Number(todayShift.netEarnings || 0) +
		currentNet
	);
};

export const calculateProjectedRemaining = ({
	goal,
	projectedCurrent,
}) => {
	if (!goal) return 0;

	return Number(goal.targetAmount || 0) - projectedCurrent;
};

export const calculateProjectedPerDay = ({
	projectedRemaining,
	daysLeft,
}) => {
	if (!daysLeft) return 0;

	return projectedRemaining / daysLeft;
};