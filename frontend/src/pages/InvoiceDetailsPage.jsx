import { ArrowLeft, Download, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import StatusBadge from "../components/ui/StatusBadge";
import Table from "../components/ui/Table";
import { COMPANY_PROFILE } from "../constants/company";
import { getInvoiceById } from "../services/invoiceService";
import { getErrorMessage } from "../utils/error";
import { formatCurrency, formatDate, shortId } from "../utils/formatters";
import { exportInvoicePdf } from "../utils/invoicePdf";

export default function InvoiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        setLoading(true);
        const data = await getInvoiceById(id);
        setInvoice(data);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [id]);

  if (loading) {
    return <Panel className="h-48 animate-pulse bg-white/50 dark:bg-slate-900/[0.35]" />;
  }

  if (errorMessage || !invoice) {
    return (
      <Panel>
        <p className="text-sm text-rose-500">{errorMessage || "Invoice not found"}</p>
      </Panel>
    );
  }

  const itemColumns = [
    {
      header: "Item",
      cell: (item) => <span className="font-semibold">{item.name}</span>
    },
    {
      header: "Quantity",
      cell: (item) => <span>{item.quantity}</span>
    },
    {
      header: "Price",
      cell: (item) => <span>{formatCurrency(item.price)}</span>
    },
    {
      header: "Amount",
      cell: (item) => <span className="font-semibold">{formatCurrency(item.quantity * item.price)}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Invoice #${shortId(invoice._id)}`}
        description="Review invoice details, customer information, and export a PDF if needed."
        action={
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => navigate("/invoices")}>
              <ArrowLeft size={16} />
              Back
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/invoices/${invoice._id}/edit`)}>
              <PencilLine size={16} />
              Edit
            </Button>
            <Button onClick={() => exportInvoicePdf(invoice, COMPANY_PROFILE)}>
              <Download size={16} />
              Export PDF
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_420px]">
        <Panel>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-theme bg-accent-soft px-4 py-4">
              <p className="text-sm font-medium text-accent">Status</p>
              <div className="mt-3">
                <StatusBadge status={invoice.status} />
              </div>
            </div>
            <div className="rounded-xl border border-theme bg-slate-50 px-4 py-4 dark:bg-slate-900/[0.35]">
              <p className="text-sm font-medium text-muted">Invoice date</p>
              <p className="mt-2 text-lg font-semibold text-[color:var(--text)]">
                {formatDate(invoice.date)}
              </p>
            </div>
            <div className="rounded-xl border border-theme bg-slate-50 px-4 py-4 dark:bg-slate-900/[0.35]">
              <p className="text-sm font-medium text-muted">Reference</p>
              <p className="mt-2 text-lg font-semibold text-[color:var(--text)]">
                #{shortId(invoice._id)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Table columns={itemColumns} data={invoice.items} emptyMessage="No line items found." />
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <h3 className="text-lg font-semibold text-[color:var(--text)]">Customer</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="font-semibold text-[color:var(--text)]">
                  {invoice.customerId?.name || "Deleted customer"}
                </p>
                <p className="text-muted">{invoice.customerId?.email || "-"}</p>
              </div>
              <p className="text-muted">{invoice.customerId?.phone || "-"}</p>
              <p className="text-muted">{invoice.customerId?.address || "-"}</p>
            </div>
          </Panel>

          <Panel>
            <h3 className="text-lg font-semibold text-[color:var(--text)]">Summary</h3>
            <div className="mt-4 rounded-xl border border-theme bg-slate-50 p-4 dark:bg-slate-950">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium text-[color:var(--text)]">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Tax</span>
                  <span className="font-medium text-[color:var(--text)]">
                    {formatCurrency(invoice.tax)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Discount</span>
                  <span className="font-medium text-[color:var(--text)]">
                    {formatCurrency(invoice.discount)}
                  </span>
                </div>
              </div>

              <div className="my-4 h-px bg-slate-200 dark:bg-slate-800" />

              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-[color:var(--text)]">Grand total</span>
                <span className="text-2xl font-bold text-[color:var(--text)]">
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
