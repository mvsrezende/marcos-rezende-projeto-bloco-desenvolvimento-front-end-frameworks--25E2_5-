function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);

  if (/[",\n\r;]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows || rows.length === 0) {
    const emptyBlob = new Blob(["\ufeff\n"], {
      type: "text/csv;charset=utf-8",
    });
    const emptyUrl = URL.createObjectURL(emptyBlob);
    const a = document.createElement("a");
    a.href = emptyUrl;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(emptyUrl);
    return;
  }

  const headers = Object.keys(rows[0]);
  const headerLine = headers.map(escapeCsvValue).join(",");

  const lines = rows.map((row) =>
    headers.map((h) => escapeCsvValue(row[h])).join(",")
  );

  const csvContent = ["\ufeff" + headerLine, ...lines].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
