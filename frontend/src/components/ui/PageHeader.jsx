export default function PageHeader({ title, description, action }) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-[color:var(--text)]">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
