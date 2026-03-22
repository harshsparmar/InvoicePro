export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-[28px] border border-dashed border-theme bg-white/40 px-6 py-12 text-center dark:bg-slate-900/[0.35]">
      <h3 className="text-lg font-bold text-[color:var(--text)]">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}
