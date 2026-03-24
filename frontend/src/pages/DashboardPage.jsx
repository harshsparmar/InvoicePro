import { BadgeCheck, IndianRupee, Clock3, FileText, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import RevenueChart from "../components/charts/RevenueChart";
import StatusDonutChart from "../components/charts/StatusDonutChart";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import Table from "../components/ui/Table";
import { getDashboardStats } from "../services/dashboardService";
import { formatCurrency, formatDate, shortId } from "../utils/formatters";
import { getErrorMessage } from "../utils/error";

const emptyDashboard = {
  stats: {
    totalRevenue: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0
  },
  monthlyRevenue: [],
  statusDistribution: [],
  recentInvoices: []
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setDashboard(data);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Panel key={index} className="h-40 animate-pulse bg-white/50 dark:bg-slate-900/[0.35]" />
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <Panel>
        <p className="text-sm text-rose-500">{errorMessage}</p>
      </Panel>
    );
  }

  const recentInvoiceColumns = [
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
      header: "Action",
      cell: (invoice) => (
        <Link to={`/invoices/${invoice._id}`} className="font-semibold text-accent">
          View invoice
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="A simple overview of revenue, invoice counts, and recent activity."
        action={
          <Button onClick={() => navigate("/invoices/new")}>
            <PlusCircle size={16} />
            New Invoice
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
        <StatCard title="Collected Revenue" value={dashboard.stats.totalRevenue} icon={IndianRupee} />
        <StatCard
          title="Total Invoices"
          value={dashboard.stats.totalInvoices}
          type="count"
          icon={FileText}
          accent="linear-gradient(90deg, rgba(59,130,246,1) 0%, rgba(14,165,233,1) 100%)"
        />
        <StatCard
          title="Paid Invoices"
          value={dashboard.stats.paidInvoices}
          type="count"
          icon={BadgeCheck}
          accent="linear-gradient(90deg, rgba(16,185,129,1) 0%, rgba(45,212,191,1) 100%)"
        />
        <StatCard
          title="Pending Invoices"
          value={dashboard.stats.pendingInvoices}
          type="count"
          icon={Clock3}
          accent="linear-gradient(90deg, rgba(245,158,11,1) 0%, rgba(251,191,36,1) 100%)"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_420px]">
        <Panel>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[color:var(--text)]">Monthly revenue</h3>
              <p className="mt-1 text-sm text-muted">Paid invoice totals for the last six months.</p>
            </div>
            <div className="rounded-xl bg-accent-soft px-3 py-2 text-sm font-medium text-accent">
              {formatCurrency(dashboard.stats.totalRevenue)} collected
            </div>
          </div>
          <div className="mt-6">
            <RevenueChart data={dashboard.monthlyRevenue} />
          </div>
        </Panel>

        <Panel>
          <h3 className="text-lg font-semibold text-[color:var(--text)]">Invoice status</h3>
          <p className="mt-1 text-sm text-muted">See what is paid and what still needs follow-up.</p>
          <div className="mt-6">
            <StatusDonutChart data={dashboard.statusDistribution} />
          </div>
          <div className="grid gap-3">
            {dashboard.statusDistribution.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl border border-theme bg-slate-50 px-4 py-3 dark:bg-slate-900/[0.35]"
              >
                <p className="font-semibold text-[color:var(--text)]">{item.name}</p>
                <p className="text-sm text-muted">{item.value} invoices</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[color:var(--text)]">Recent invoices</h3>
            <p className="mt-1 text-sm text-muted">The latest billing activity from your workspace.</p>
          </div>
          <Link to="/invoices" className="font-semibold text-accent">
            See all invoices
          </Link>
        </div>

        <div className="mt-6">
          <Table
            columns={recentInvoiceColumns}
            data={dashboard.recentInvoices}
            emptyMessage="No invoices yet. Create your first one to start seeing activity here."
          />
        </div>
      </Panel>
    </div>
  );
}
