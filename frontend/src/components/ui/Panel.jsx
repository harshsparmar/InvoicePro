import { cn } from "../../utils/cn";

export default function Panel({ className, children }) {
  return <section className={cn("surface-card p-4 md:p-5", className)}>{children}</section>;
}
