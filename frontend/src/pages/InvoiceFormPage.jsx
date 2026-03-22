import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import InvoiceForm from "../components/invoices/InvoiceForm";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import { getCustomers } from "../services/customerService";
import { createInvoice, getInvoiceById, updateInvoice } from "../services/invoiceService";
import { getErrorMessage } from "../utils/error";

export default function InvoiceFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [customers, setCustomers] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        const [customerResponse, invoiceResponse] = await Promise.all([
          getCustomers({ page: 1, limit: 100 }),
          isEdit ? getInvoiceById(id) : Promise.resolve(null)
        ]);

        setCustomers(customerResponse.items);
        setInvoice(invoiceResponse);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [id, isEdit]);

  const handleSubmit = async (payload) => {
    try {
      setSubmitting(true);
      const savedInvoice = isEdit
        ? await updateInvoice(id, payload)
        : await createInvoice(payload);
      navigate(`/invoices/${savedInvoice._id}`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Panel className="h-48 animate-pulse bg-white/50 dark:bg-slate-900/[0.35]" />;
  }

  if (errorMessage && !customers.length && !invoice) {
    return (
      <Panel>
        <p className="text-sm text-rose-500">{errorMessage}</p>
      </Panel>
    );
  }

  if (isEdit && !invoice) {
    return (
      <Panel>
        <p className="text-sm text-rose-500">{errorMessage || "Invoice not found."}</p>
      </Panel>
    );
  }

  if (!customers.length) {
    return (
      <Panel>
        <p className="text-lg font-semibold text-[color:var(--text)]">Add a customer first</p>
        <p className="mt-2 text-sm text-muted">
          You need at least one customer before an invoice can be created.
        </p>
        <div className="mt-4">
          <Button onClick={() => navigate("/customers")}>Go to customers</Button>
        </div>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? "Edit invoice" : "Create invoice"}
        description="Select a customer, add itemized charges, and let the totals calculate automatically."
        action={
          <Button variant="secondary" onClick={() => navigate(isEdit ? `/invoices/${id}` : "/invoices")}>
            <ArrowLeft size={16} />
            Back
          </Button>
        }
      />

      {errorMessage ? (
        <Panel>
          <p className="text-sm text-rose-500">{errorMessage}</p>
        </Panel>
      ) : null}

      <InvoiceForm
        customers={customers}
        initialValues={invoice}
        onSubmit={handleSubmit}
        onCancel={() => navigate(isEdit ? `/invoices/${id}` : "/invoices")}
        loading={submitting}
      />
    </div>
  );
}
