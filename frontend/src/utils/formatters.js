const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1
});

export const formatCurrency = (value) => currency.format(Number(value || 0));

export const formatCompactNumber = (value) => compactNumber.format(Number(value || 0));

export const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));

export const formatDateInput = (value) => {
  const date = new Date(value);
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

export const shortId = (value) => String(value || "").slice(-6).toUpperCase();

