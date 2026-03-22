import { PencilLine, PlusCircle, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";

import CustomerFormModal from "../components/customers/CustomerFormModal";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import PaginationControls from "../components/ui/PaginationControls";
import Panel from "../components/ui/Panel";
import Table from "../components/ui/Table";
import useDebouncedValue from "../hooks/useDebouncedValue";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer
} from "../services/customerService";
import { getErrorMessage } from "../utils/error";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const loadCustomers = async (targetPage = page) => {
    try {
      setLoading(true);
      const data = await getCustomers({
        page: targetPage,
        limit: 8,
        search: debouncedSearch
      });
      setCustomers(data.items);
      setPagination(data.pagination);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers(page);
  }, [page, debouncedSearch]);

  const closeModal = () => {
    setModalOpen(false);
    setActiveCustomer(null);
    setFormError("");
  };

  const handleSaveCustomer = async (payload) => {
    try {
      setSubmitting(true);
      if (activeCustomer?._id) {
        await updateCustomer(activeCustomer._id, payload);
      } else {
        await createCustomer(payload);
      }
      closeModal();
      const nextPage = activeCustomer?._id ? page : 1;
      setPage(nextPage);
      await loadCustomers(nextPage);
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (customer) => {
    const confirmed = window.confirm(`Delete ${customer.name}? Existing linked invoices will block this.`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteCustomer(customer._id);
      const nextPage = customers.length === 1 && page > 1 ? page - 1 : page;
      setPage(nextPage);
      await loadCustomers(nextPage);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  const customerColumns = [
    {
      header: "Customer",
      cell: (customer) => (
        <div>
          <p className="font-semibold">{customer.name}</p>
          <p className="text-xs text-muted">{customer.email}</p>
        </div>
      )
    },
    {
      header: "Phone",
      cell: (customer) => <span>{customer.phone}</span>
    },
    {
      header: "Address",
      cell: (customer) => <span className="text-sm text-muted">{customer.address}</span>
    },
    {
      header: "Actions",
      cell: (customer) => (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setActiveCustomer(customer);
              setModalOpen(true);
            }}
          >
            <PencilLine size={16} />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-rose-500 hover:bg-rose-500/10"
            onClick={() => handleDeleteCustomer(customer)}
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
        title="Customers"
        description="Manage the customer details used when creating invoices."
        action={
          <Button
            onClick={() => {
              setActiveCustomer(null);
              setModalOpen(true);
            }}
          >
            <PlusCircle size={16} />
            Add Customer
          </Button>
        }
      />

      <Panel>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
          <Input
            label="Search customers"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, phone, or address"
          />

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[color:var(--text)]">Total customers</span>
            <div className="flex min-h-[42px] items-center justify-between rounded-xl border border-theme bg-slate-50 px-3 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-sm font-medium text-muted">
                <Users size={16} />
                Total
              </div>
              <p className="text-base font-semibold text-[color:var(--text)]">
                {pagination.totalItems || customers.length}
              </p>
            </div>
          </div>
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
              columns={customerColumns}
              data={customers}
              emptyMessage="No customers found. Add your first client to start building invoices."
            />
            <PaginationControls pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </Panel>

      <CustomerFormModal
        isOpen={modalOpen}
        initialValues={activeCustomer}
        onClose={closeModal}
        onSubmit={handleSaveCustomer}
        loading={submitting}
        errorMessage={formError}
      />
    </div>
  );
}
