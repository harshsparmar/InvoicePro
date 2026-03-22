import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { formatCurrency, formatDateInput } from "../../utils/formatters";
import { calculateInvoiceTotals, emptyInvoiceItem } from "../../utils/invoiceMath";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Panel from "../ui/Panel";
import SelectField from "../ui/SelectField";

const buildInitialForm = (initialValues) => ({
  customerId: initialValues?.customerId?._id || initialValues?.customerId || "",
  status: initialValues?.status || "pending",
  date: initialValues?.date ? formatDateInput(initialValues.date) : formatDateInput(new Date()),
  tax: initialValues?.tax ?? 0,
  discount: initialValues?.discount ?? 0,
  items:
    initialValues?.items?.length > 0
      ? initialValues.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      : [emptyInvoiceItem()]
});

export default function InvoiceForm({
  customers,
  initialValues,
  onSubmit,
  onCancel,
  loading
}) {
  const [formData, setFormData] = useState(buildInitialForm(initialValues));
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setFormData(buildInitialForm(initialValues));
    setErrorMessage("");
  }, [initialValues]);

  const totals = calculateInvoiceTotals(formData);
  const selectedCustomer = customers.find((customer) => customer._id === formData.customerId);
  const hasMultipleItems = formData.items.length > 1;

  const handleFieldChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = () => {
    setFormData((current) => ({
      ...current,
      items: [...current.items, emptyInvoiceItem()]
    }));
  };

  const removeItem = (index) => {
    setFormData((current) => ({
      ...current,
      items:
        current.items.length === 1
          ? current.items
          : current.items.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.customerId) {
      setErrorMessage("Please choose a customer before saving the invoice.");
      return;
    }

    if (formData.items.some((item) => !item.name || Number(item.quantity) <= 0)) {
      setErrorMessage("Each item needs a name and a quantity greater than zero.");
      return;
    }

    setErrorMessage("");

    await onSubmit({
      customerId: formData.customerId,
      status: formData.status,
      date: formData.date,
      tax: Number(formData.tax || 0),
      discount: Number(formData.discount || 0),
      items: formData.items.map((item) => ({
        name: item.name,
        quantity: Number(item.quantity || 0),
        price: Number(item.price || 0)
      }))
    });
  };

  return (
    <form className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_360px]" onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Panel>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[color:var(--text)]">1. Invoice details</h3>
            <p className="mt-1 text-sm text-muted">
              Choose the customer, invoice date, and payment status.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Customer"
              value={formData.customerId}
              onChange={(event) => handleFieldChange("customerId", event.target.value)}
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Status"
              value={formData.status}
              onChange={(event) => handleFieldChange("status", event.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </SelectField>

            <Input
              label="Invoice date"
              type="date"
              value={formData.date}
              onChange={(event) => handleFieldChange("date", event.target.value)}
            />

            <div className="rounded-xl border border-theme bg-accent-soft px-4 py-3">
              <p className="text-sm font-medium text-accent">Selected customer</p>
              <p className="mt-2 font-semibold text-[color:var(--text)]">
                {selectedCustomer?.name || "No customer selected"}
              </p>
              <p className="mt-1 text-sm text-muted">
                {selectedCustomer?.email || "Choose a customer to preview billing info."}
              </p>
            </div>
          </div>
        </Panel>

        <Panel>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[color:var(--text)]">2. Invoice items</h3>
              <p className="mt-1 text-sm text-muted">
                Add what you are charging for. The total updates automatically.
              </p>
            </div>

            <Button variant="secondary" onClick={addItem}>
              <Plus size={16} />
              Add Item
            </Button>
          </div>

          <div className="mt-5 hidden rounded-xl border border-theme bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 dark:bg-slate-900 md:grid md:grid-cols-[minmax(0,1.8fr)_120px_140px_140px_96px] md:gap-4 dark:text-slate-300">
            <span>Description</span>
            <span>Qty</span>
            <span>Price</span>
            <span>Amount</span>
            <span>Action</span>
          </div>

          <div className="mt-4 space-y-3">
            {formData.items.map((item, index) => (
              <div
                key={`item-${index}`}
                className="grid gap-3 rounded-xl border border-theme bg-white p-4 dark:bg-slate-900 md:grid-cols-[minmax(0,1.8fr)_120px_140px_140px_96px] md:items-end"
              >
                <Input
                  label={`Item ${index + 1}`}
                  value={item.name}
                  onChange={(event) => handleItemChange(index, "name", event.target.value)}
                  placeholder="Website design"
                />
                <Input
                  label="Quantity"
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) => handleItemChange(index, "quantity", event.target.value)}
                />
                <Input
                  label="Price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(event) => handleItemChange(index, "price", event.target.value)}
                />
                <div className="rounded-xl border border-theme bg-slate-50 px-3 py-2.5 dark:bg-slate-950">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted md:hidden">
                    Amount
                  </p>
                  <p className="text-sm font-semibold text-[color:var(--text)]">
                    {formatCurrency(Number(item.quantity || 0) * Number(item.price || 0))}
                  </p>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    className="w-full text-rose-500 hover:bg-rose-500/10"
                    onClick={() => removeItem(index)}
                    disabled={!hasMultipleItems}
                  >
                    <Minus size={16} />
                    {hasMultipleItems ? "Remove" : "Keep"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="space-y-6">
        <Panel className="xl:sticky xl:top-6">
          <h3 className="text-lg font-semibold text-[color:var(--text)]">3. Totals</h3>
          <p className="mt-1 text-sm text-muted">
            Add tax or discount only if needed. Otherwise leave them as 0.
          </p>
          <div className="mt-4 grid gap-4">
            <Input
              label="Tax"
              type="number"
              min="0"
              step="0.01"
              value={formData.tax}
              onChange={(event) => handleFieldChange("tax", event.target.value)}
            />
            <Input
              label="Discount"
              type="number"
              min="0"
              step="0.01"
              value={formData.discount}
              onChange={(event) => handleFieldChange("discount", event.target.value)}
            />
          </div>
          <div className="mt-5 rounded-xl border border-theme bg-slate-50 p-4 dark:bg-slate-950">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium text-[color:var(--text)]">
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Tax</span>
                <span className="font-medium text-[color:var(--text)]">
                  {formatCurrency(totals.tax)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Discount</span>
                <span className="font-medium text-[color:var(--text)]">
                  {formatCurrency(totals.discount)}
                </span>
              </div>
            </div>

            <div className="my-4 h-px bg-slate-200 dark:bg-slate-800" />

            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-[color:var(--text)]">Grand total</span>
              <span className="text-2xl font-bold text-[color:var(--text)]">
                {formatCurrency(totals.total)}
              </span>
            </div>
          </div>

          {errorMessage ? <p className="mt-4 text-sm text-rose-500">{errorMessage}</p> : null}

          <div className="mt-5 flex flex-col gap-3">
            <Button type="submit" loading={loading} className="w-full">
              Save Invoice
            </Button>
            <Button variant="secondary" onClick={onCancel} className="w-full">
              Cancel
            </Button>
          </div>
        </Panel>
      </div>
    </form>
  );
}
