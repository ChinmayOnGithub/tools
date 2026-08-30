interface ReferenceTableProps {
  headers: string[];
  rows: string[][];
  caption?: string;
  className?: string;
}

export default function ReferenceTable({
  headers,
  rows,
  caption,
  className = '',
}: ReferenceTableProps) {
  return (
    <div className={`overflow-x-auto my-4 border-2 border-border ${className}`}>
      <table className="w-full text-left text-xs border-collapse">
        {caption && (
          <caption className="text-left text-[11px] text-muted-foreground p-2 italic bg-muted/20 border-b border-border">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="bg-muted/40 border-b-2 border-border">
            {headers.map((h, idx) => (
              <th key={idx} className="p-2.5 font-black text-[11px] uppercase tracking-wider text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 bg-card">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-muted/20 transition-colors">
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className={`p-2.5 text-[11px] leading-relaxed ${
                    cIdx === 0 ? 'font-bold text-foreground' : 'text-muted-foreground font-medium'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
