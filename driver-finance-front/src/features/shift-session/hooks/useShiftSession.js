import {
	useCallback,
	useMemo,
	useState,
} from "react";

import { hydrateSessionFromShift } from "../domain/sessionHydration";

import { calculateCurrentNet } from "../domain/sessionCalculations";

import { debugLog } from "../../../shared/debug/debugLogger";

export const useShiftSession = () => {
	const [income, setIncome] = useState("");

	const [gas, setGas] = useState("");

	const [otherExpenses, setOtherExpenses] = useState("");

	const currentNet = useMemo(() => {
		const result = calculateCurrentNet({
			income,
			gas,
			otherExpenses,
		});

			return result;
	}, [income, gas, otherExpenses]);

	const hydrateSession = useCallback((shift) => {
		const hydratedSession = hydrateSessionFromShift(shift);

		setIncome(hydratedSession.income);

		setGas(hydratedSession.gas);

		setOtherExpenses(hydratedSession.otherExpenses);

	}, []);

	const resetSession = useCallback(() => {
		debugLog("SESSION", "RESET");

		const emptySession = hydrateSessionFromShift(null);

		setIncome(emptySession.income);

		setGas(emptySession.gas);

		setOtherExpenses(emptySession.otherExpenses);
	}, []);

	return {
		income,
		setIncome,

		gas,
		setGas,

		otherExpenses,
		setOtherExpenses,

		currentNet,

		hydrateSession,

		resetSession,
	};
};