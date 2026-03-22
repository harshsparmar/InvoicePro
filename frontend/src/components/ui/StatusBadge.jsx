import { cn } from "../../utils/cn";

const styles = {
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/[0.15] dark:text-emerald-300",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-400/[0.15] dark:text-amber-300"
};

export default function StatusBadge({ status }) {
  const normalizedStatus = String(status || "pending").toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        styles[normalizedStatus] || styles.pending
      )}
    >
      {normalizedStatus}
    </span>
  );
}
