import type { IAdvancedTableData } from '@thanhpv102/easy-email-core';

/**
 * Normalize arbitrary HTML or text into a clean "paste as value" string.
 * Strips HTML comments and all tags, returning the trimmed text content only.
 */
export function normalizeTextContent(htmlOrTextData: string): string {
  const stripped = (htmlOrTextData || '').replace(/<!--[\s\S]*?-->/g, '');
  const doc = new DOMParser().parseFromString(stripped, 'text/html');
  return (doc.body.textContent || '').trim();
}

/**
 * Parse clipboard HTML (e.g. from Microsoft Excel) into a normalized 2-D matrix
 * of table cells. Returns null when the input is empty or contains no <table>.
 * Each cell's content is normalized to plain text ("paste as value").
 */
export function parseExcelTable(htmlData: string): IAdvancedTableData[][] | null {
  if (!htmlData) return null;

  const doc = new DOMParser().parseFromString(htmlData, 'text/html');
  const table = doc.querySelector('table');
  if (!table) return null;

  const rows = Array.from(table.querySelectorAll('tr'));
  return rows.map((row) => {
    const cells = Array.from(row.querySelectorAll('td, th'));
    return cells.map((cell) => ({ content: normalizeTextContent(cell.innerHTML) }));
  });
}
