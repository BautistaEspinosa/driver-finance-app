const ENABLE_DEBUG = true;

const ENABLED_MODULES = {
	API: false,
	SESSION: true,
	CONTROLLER: true,
	UI: false,
};

const IGNORED_EVENTS = {
	SESSION: [
		"NET_UPDATED",
		"STATE_UPDATED",
	],
	CONTROLLER: [
		"RENDER",
	],
};

export const debugLog = (
	module,
	event,
	payload = null
) => {
	if (!ENABLE_DEBUG) {
		return;
	}

	if (!ENABLED_MODULES[module]) {
		return;
	}

	const ignored =
		IGNORED_EVENTS[module]?.includes(event);

	if (ignored) {
		return;
	}

	const time = new Date().toLocaleTimeString();

	if (payload) {
		console.log(
			`[${time}] [${module}] ${event}`,
			payload
		);

		return;
	}

	console.log(
		`[${time}] [${module}] ${event}`
	);
};