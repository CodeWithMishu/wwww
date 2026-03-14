const escapeValue = (value: string | number): string => {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes("\n") || text.includes("\"")) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
};

export const toCsv = (headers: string[], rows: Array<Array<string | number>>): string => {
  const lines: string[] = [];
  lines.push(headers.map(escapeValue).join(","));
  rows.forEach((row) => {
    lines.push(row.map(escapeValue).join(","));
  });
  return lines.join("\n");
};

export const parseCsv = (raw: string): string[][] => {
  if (!raw.trim()) {
    return [];
  }
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(",").map((value) => value.trim().replace(/^"|"$/g, "")));
};
