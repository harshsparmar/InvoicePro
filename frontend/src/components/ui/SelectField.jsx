import { cn } from "../../utils/cn";

export default function SelectField({ label, error, className, children, ...props }) {
  return (
    <label className="flex flex-col gap-2">
      {label ? (
        <span className="text-sm font-semibold text-[color:var(--text)]">
          {label}
        </span>
      ) : null}

      <select
        className={cn(
          "field-shell min-h-[42px] rounded-xl px-3 py-2.5 text-[color:var(--text)] outline-none transition focus:border-teal-500/60 focus:ring-2 focus:ring-teal-500/[0.15]",
          className
        )}
        {...props}
      >
        {children}
      </select>

      {error ? <span className="text-sm text-rose-500">{error}</span> : null}
    </label>
  );
}
