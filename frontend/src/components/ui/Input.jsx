import { cn } from "../../utils/cn";

export default function Input({
  label,
  error,
  hint,
  as = "input",
  className,
  ...props
}) {
  const Component = as === "textarea" ? "textarea" : "input";

  return (
    <label className="flex flex-col gap-2">
      {label ? (
        <span className="text-sm font-semibold text-[color:var(--text)]">
          {label}
        </span>
      ) : null}

      <Component
        className={cn(
          "field-shell min-h-[42px] rounded-xl px-3 py-2.5 text-[color:var(--text)] outline-none transition placeholder:text-slate-400 focus:border-teal-500/60 focus:ring-2 focus:ring-teal-500/[0.15]",
          as === "textarea" ? "min-h-[110px] resize-y" : "",
          className
        )}
        {...props}
      />

      {error ? <span className="text-sm text-rose-500">{error}</span> : null}
      {!error && hint ? <span className="text-sm text-muted">{hint}</span> : null}
    </label>
  );
}
