const BASE_URL = `${import.meta.env.VITE_API_URL}/shifts`;
const BASE_URL_GOALS = `${import.meta.env.VITE_API_URL}/goals`;
const BASE_URL_DEV = `${import.meta.env.VITE_API_URL}/dev/time`;

const handleResponse = async (res) => {
	const json = await res.json();

	if (!json.success) {
		const err = new Error(json.error || "Error desconocido");
		err.status = res.status;
		throw err;
	}

	return json.data;
};

export const getShifts = async (params = "") => {
	const res = await fetch(`${BASE_URL}${params}`);
	return handleResponse(res);
};

export const getSummary = async (params = "") => {
	const res = await fetch(`${BASE_URL}/summary${params}`);
	return handleResponse(res);
};

export const createShift = async (payload) => {
	const res = await fetch(BASE_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	return handleResponse(res);
};

export const updateShift = async (id, payload) => {
	const res = await fetch(`${BASE_URL}/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	return handleResponse(res);
};

export const patchShift = async (id, payload) => {
	const res = await fetch(`${BASE_URL}/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	return handleResponse(res);
};

export const deleteShift = async (id) => {
	const res = await fetch(`${BASE_URL}/${id}`, {
		method: "DELETE",
	});

	if (!res.ok) {
		let message = "Error al eliminar";

		try {
			const json = await res.json();
			message = json.error || message;
		} catch {}

		const err = new Error(message);
		err.status = res.status;

		throw err;
	}

	return null;
};

export const getGoalProgress = async () => {
	const res = await fetch(`${BASE_URL_GOALS}/current`);
	return handleResponse(res);
};

export const createGoal = async (payload) => {
	const res = await fetch(BASE_URL_GOALS, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	return handleResponse(res);
};

export const getCurrentDevDate = async () => {
	const res = await fetch(BASE_URL_DEV);
	return handleResponse(res);
};

export const setDevDate = async (date) => {
	const res = await fetch(`${BASE_URL_DEV}?date=${date}`, {
		method: "PUT",
	});

	return handleResponse(res);
};

export const resetDevDate = async () => {
	const res = await fetch(BASE_URL_DEV, {
		method: "DELETE",
	});

	return handleResponse(res);
};