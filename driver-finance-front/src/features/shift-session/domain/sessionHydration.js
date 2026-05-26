import { createEmptySessionState } from "./sessionState";

import { debugLog } from "../../../shared/debug/debugLogger";

export const hydrateSessionFromShift = (shift) => {
	debugLog("SESSION", "HYDRATE_START", {
		hasShift: !!shift,
	});

	if (!shift) {
		debugLog("SESSION", "EMPTY_SESSION");

		return createEmptySessionState();
	}

	const hydratedSession = {
		income:
			shift.income !== null && shift.income !== undefined
				? String(shift.income)
				: "",

		gas:
			shift.gas !== null && shift.gas !== undefined
				? String(shift.gas)
				: "",

		otherExpenses:
			shift.otherExpenses !== null &&
			shift.otherExpenses !== undefined
				? String(shift.otherExpenses)
				: "",
	};

	debugLog("SESSION", "HYDRATED", {
		income: hydratedSession.income,
		gas: hydratedSession.gas,
		other: hydratedSession.otherExpenses,
	});

	return hydratedSession;
};