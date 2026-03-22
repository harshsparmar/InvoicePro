export const emptyInvoiceItem = () => ({
  name: "",
  quantity: 1,
  price: 0
});

const round = (value) => Number(Number(value || 0).toFixed(2));

export const calculateInvoiceTotals = ({ items, tax, discount }) => {
  const safeItems = Array.isArray(items) ? items : [];

  const subtotal = round(
    safeItems.reduce((sum, item) => {
      const quantity = Number(item.quantity || 0);
      const price = Number(item.price || 0);
      return sum + quantity * price;
    }, 0)
  );

  const safeTax = round(tax);
  const safeDiscount = round(discount);
  const total = round(Math.max(subtotal + safeTax - safeDiscount, 0));

  return {
    subtotal,
    tax: safeTax,
    discount: safeDiscount,
    total
  };
};

