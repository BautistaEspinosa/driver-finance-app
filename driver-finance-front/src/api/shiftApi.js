const BASE_URL = "http://localhost:8080/api/shifts";

export const getShifts = async () => {
  const res = await fetch(BASE_URL);
  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error);
  }

  return json.data;
};