export const formatMoney = (value) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value || 0);
};

export const safeNumber = (v) => Number(v) || 0;