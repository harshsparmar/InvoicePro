export default function Table({ columns, data, emptyMessage, rowKey = "_id" }) {
  if (!data.length) {
    return (
      <div className="rounded-xl border border-dashed border-theme bg-slate-50 px-6 py-12 text-center dark:bg-slate-900/[0.35]">
        <p className="text-sm font-semibold text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-theme">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/60 dark:divide-slate-800">
          <thead className="bg-slate-50 text-left text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className="whitespace-nowrap px-4 py-3">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 bg-white text-sm dark:divide-slate-800 dark:bg-slate-950/[0.35]">
            {data.map((row, index) => (
              <tr
                key={
                  typeof rowKey === "function"
                    ? rowKey(row, index)
                    : row[rowKey] ?? `${rowKey}-${index}`
                }
              >
                {columns.map((column) => (
                  <td key={column.header} className="px-4 py-3 align-top text-[color:var(--text)]">
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
