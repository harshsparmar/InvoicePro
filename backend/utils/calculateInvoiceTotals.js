const normalizeNumber = (value, fieldName) => {
  const numericValue = Number(value ?? 0);

  if (Number.isNaN(numericValue) || numericValue < 0) {
    throw new Error(`${fieldName} must be a valid non-negative number`);
  }

  return Number(numericValue.toFixed(2));
};

const calculateInvoiceTotals = (payload) => {
  const rawItems = Array.isArray(payload.items) ? payload.items : [];

  if (rawItems.length === 0) {
    throw new Error("Invoice must contain at least one item");
  }

  const items = rawItems.map((item, index) => {
    const name = String(item.name || "").trim();
    const quantity = Number(item.quantity);
    const price = Number(item.price);

    if (!name) {
      throw new Error(`Item ${index + 1} must include a name`);
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error(`Item ${index + 1} must include a valid quantity`);
    }

    if (!Number.isFinite(price) || price < 0) {
      throw new Error(`Item ${index + 1} must include a valid price`);
    }

    return {
      name,
      quantity: Number(quantity.toFixed(2)),
      price: Number(price.toFixed(2))
    };
  });

  const subtotal = Number(
    items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)
  );
  const tax = normalizeNumber(payload.tax, "Tax");
  const discount = normalizeNumber(payload.discount, "Discount");
  const total = Number(Math.max(subtotal + tax - discount, 0).toFixed(2));

  return {
    items,
    subtotal,
    tax,
    discount,
    total
  };
};

export default calculateInvoiceTotals;

