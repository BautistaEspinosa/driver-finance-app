const BASE_URL = "http://localhost:8080/api/shifts";

export const createShift = async (payload) => {
  console.log("Enviando turno:", payload);

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  console.log("Respuesta createShift:", json);

  return json;
};

export const getSummary = async (params = "") => {
  console.log("GET summary:", `${BASE_URL}/summary${params}`);

  const res = await fetch(`${BASE_URL}/summary${params}`);
  const json = await res.json();

  console.log("Summary response:", json);

  return json;
};

export const getShifts = async () => {
  console.log("GET shifts");

  const res = await fetch(BASE_URL);
  const json = await res.json();

  console.log("Shifts response:", json);

  if (!json.success) {
    throw new Error(json.error);
  }

  return json.data;
};