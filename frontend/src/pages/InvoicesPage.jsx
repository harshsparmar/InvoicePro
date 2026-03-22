import { Eye, PencilLine, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import PaginationControls from "../components/ui/PaginationControls";
import Panel from "../components/ui/Panel";
import SelectField from "../components/ui/SelectField";
import StatusBadge from "../components/ui/StatusBadge";
import Table from "../components/ui/Table";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { deleteInvoice, getInvoices } from "../services/invoiceService";
import { getErrorMessage } from "../utils/error";
import { formatCurrency, formatDate, shortId } from "../utils/formatters";

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const loadInvoices = async (targetPage = page) => {
    try {
      setLoading(true);
      const data = await getInvoices({
        page: targetPage,
        limit: 8,
        search: debouncedSearch,
        status
      });
      setInvoices(data.items);
      setPagination(data.pagination);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices(page);
  }, [page, debouncedSearch, status]);

  const handleDeleteInvoice = async (invoice) => {
    const confirmed = window.confirm(`Delete invoice #${shortId(invoice._id)}?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteInvoice(invoice._id);
      const nextPage = invoices.length === 1 && page > 1 ? page - 1 : page;
      setPage(nextPage);
      await loadInvoices(nextPage);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  const invoiceColumns = [
    {
      header: "Invoice",
      cell: (invoice) => (
        <div>
          <p className="font-semibold">#{shortId(invoice._id)}</p>
          <p className="text-xs text-muted">{formatDate(invoice.date)}</p>
        </div>
      )
    },
    {
      header: "Customer",
      cell: (invoice) => (
        <div>
          <p className="font-semibold">{invoice.customerId?.name || "Deleted customer"}</p>
          <p className="text-xs text-muted">{invoice.customerId?.email || "-"}</p>
        </div>
      )
    },
    {
      header: "Status",
      cell: (invoice) => <StatusBadge status={invoice.status} />
    },
    {
      header: "Total",
      cell: (invoice) => <span className="font-semibold">{formatCurrency(invoice.total)}</span>
    },
    {
      header: "Actions",
      cell: (invoice) => (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate(`/invoices/${invoice._id}`)}>
            <Eye size={16} />
            View
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/invoices/${invoice._id}/edit`)}
          >
            <PencilLine size={16} />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-rose-500 hover:bg-rose-500/10"
            onClick={() => handleDeleteInvoice(invoice)}
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Search, filter, and manage all of your invoices in one place."
        action={
          <Button onClick={() => navigate("/invoices/new")}>
            <PlusCircle size={16} />
            Create Invoice
          </Button>
        }
      />

      <Panel>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <Input
            label="Search invoices"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by customer or item name"
          />
          <SelectField
            label="Filter by status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </SelectField>
        </div>
      </Panel>

      {errorMessage ? (
        <Panel>
          <p className="text-sm text-rose-500">{errorMessage}</p>
        </Panel>
      ) : null}

      <Panel>
        {loading ? (
          <div className="h-40 animate-pulse rounded-xl bg-white/50 dark:bg-slate-900/[0.35]" />
        ) : (
          <>
            <Table
              columns={invoiceColumns}
              data={invoices}
              emptyMessage="No invoices found. Create one to start tracking billing activity."
            />
            <PaginationControls pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </Panel>
    </div>
  );
}
