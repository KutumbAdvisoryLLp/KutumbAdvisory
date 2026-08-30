export type CsvRow = (string | number | null | undefined)[];

function escapeCell(cell: string | number | null | undefined): string {
  const str = cell === null || cell === undefined ? "" : String(cell);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// A leading UTF-8 BOM keeps Excel from mangling non-ASCII characters (₹, é, etc.)
// when it opens a plain .csv file.
export function downloadCsv(filename: string, rows: CsvRow[]) {
  const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
