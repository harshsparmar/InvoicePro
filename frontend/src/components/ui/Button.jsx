import { LoaderCircle } from "lucide-react";

import { cn } from "../../utils/cn";

const variants = {
  primary: "bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-500 dark:text-slate-950",
  secondary:
    "border border-theme bg-white text-[color:var(--text)] hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800",
  ghost: "text-[color:var(--text)] hover:bg-slate-100 dark:hover:bg-slate-800",
  danger: "bg-rose-600 text-white hover:bg-rose-500"
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base"
};

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-500/40 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? <LoaderCircle size={16} className="animate-spin" /> : null}
      {children}
    </button>
  );
}
