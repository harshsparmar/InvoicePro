import { ChevronLeft, ChevronRight } from "lucide-react";

import Button from "./Button";

export default function PaginationControls({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-3xl border border-theme bg-white/50 px-4 py-4 text-sm dark:bg-slate-900/[0.35] md:flex-row md:items-center md:justify-between">
      <p className="text-muted">
        Page <span className="font-semibold text-[color:var(--text)]">{pagination.page}</span> of{" "}
        <span className="font-semibold text-[color:var(--text)]">{pagination.totalPages}</span>
      </p>

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          disabled={pagination.page <= 1}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          <ChevronLeft size={16} />
          Previous
        </Button>

        <Button
          variant="secondary"
          size="sm"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Next
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
