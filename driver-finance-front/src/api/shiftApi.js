const BASE_URL = "http://localhost:8080/api/shifts";
const BASE_URL_WEEKLY_GOAL = "http://localhost:8080/api/weekly-goals";

// 🔥 helper centralizado
const handleResponse = async (res) => {
  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || "Error desconocido");
  }

  return json.data;
};

// =======================
// SHIFTS
// =======================

export const getShifts = async () => {
  const res = await fetch(BASE_URL);
  return handleResponse(res);
};

export const createShift = async (payload) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
};

export const getSummary = async (params = "") => {
  const res = await fetch(`${BASE_URL}/summary${params}`);
  return handleResponse(res);
};

export const deleteShift = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  return handleResponse(res);
};

export const updateShift = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
};

export const patchShift = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
};

// =======================
// WEEKLY GOAL
// =======================

export const getWeeklyGoal = async () => {
  const res = await fetch(`${BASE_URL_WEEKLY_GOAL}/current`);
  return handleResponse(res);
};

export const createWeeklyGoal = async (payload) => {
  const res = await fetch(BASE_URL_WEEKLY_GOAL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
};