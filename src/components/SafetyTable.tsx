/** Year-by-year safety statistics, readable on any screen width (first column stays in view). */
export default function SafetyTable({
  years,
  rows,
  caption,
}: {
  years: string[];
  rows: { label: string; values: string[] }[];
  caption: string;
}) {
  return (
    <div className="overflow-x-auto border border-line">
      <table className="tabular w-full min-w-[680px] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-mist">
            <th scope="col" className="sticky left-0 bg-mist px-5 py-4 text-sm font-medium text-muted">
              <span className="sr-only">Measure</span>
            </th>
            {years.map((y) => (
              <th key={y} scope="col" className="px-5 py-4 text-right text-sm font-medium text-ink">
                {y}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-line">
              <th scope="row" className="sticky left-0 bg-white px-5 py-4 text-left font-normal text-ink">
                {r.label}
              </th>
              {r.values.map((v, i) => (
                <td key={i} className={`px-5 py-4 text-right ${v === "0" ? "text-muted" : "font-medium"}`}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
