import { formatCompactNumber, formatCurrency } from "../../utils/formatters";
import Panel from "./Panel";

export default function StatCard({ title, value, type = "currency", icon: Icon, accent }) {
  const displayValue = type === "count" ? formatCompactNumber(value) : formatCurrency(value);

  return (
    <Panel className="relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background:
            accent ||
            "linear-gradient(90deg, rgba(20,184,166,1) 0%, rgba(245,158,11,1) 100%)"
        }}
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="mt-2 text-3xl font-bold text-[color:var(--text)]">{displayValue}</p>
        </div>
        {Icon ? (
          <div className="rounded-xl bg-accent-soft p-3 text-accent">
            <Icon size={20} />
          </div>
        ) : null}
      </div>
    </Panel>
  );
}
