import type { IAdvancedTableData } from '@thanhpv102/easy-email-core';

// Block-level elements whose boundaries should separate adjacent text so that
// e.g. <div>A</div><div>B</div> normalizes to "A B", not "AB".
const BLOCK_LEVEL_TAGS = [
  'address', 'article', 'aside', 'blockquote', 'div', 'dl', 'dd', 'dt',
  'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3',
  'h4', 'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav', 'ol', 'p', 'pre',
  'section', 'table', 'tbody', 'thead', 'tfoot', 'tr', 'td', 'th', 'ul',
];

/**
 * Normalize arbitrary HTML or text into a clean "paste as value" string.
 * Strips HTML comments, <style>/<script> elements, and all tags. Inline tags
 * (<span>, <b>, ...) stay seamless; block-level elements and <br> separate
 * adjacent text with a single space. Runs of whitespace collapse to one space.
 */
export function normalizeTextContent(htmlOrTextData: string): string {
  const stripped = (htmlOrTextData || '').replace(/<!--[\s\S]*?-->/g, '');
  const doc = new DOMParser().parseFromString(stripped, 'text/html');

  // <style>/<script> text is part of textContent; remove so it never leaks.
  doc.querySelectorAll('style, script').forEach((el) => el.remove());

  // Insert a separator space for <br> and after each block-level element so
  // textContent (which ignores element boundaries) doesn't fuse their text.
  doc.querySelectorAll('br').forEach((br) => {
    br.replaceWith(doc.createTextNode(' '));
  });
  doc.querySelectorAll(BLOCK_LEVEL_TAGS.join(',')).forEach((el) => {
    el.appendChild(doc.createTextNode(' '));
  });

  const text = doc.body.textContent || '';
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Parse clipboard HTML (e.g. from Microsoft Excel) into a normalized 2-D matrix
 * of table cells. Returns null when the input is empty or contains no <table>.
 * Only the first table's top-level rows/cells form the matrix; nested tables
 * flatten into their containing cell's text. Each cell's content is normalized
 * to plain text ("paste as value").
 */
export function parseExcelTable(htmlData: string): IAdvancedTableData[][] | null {
  if (!htmlData) return null;

  const doc = new DOMParser().parseFromString(htmlData, 'text/html');
  const table = doc.querySelector('table');
  if (!table) return null;

  // Only rows whose nearest ancestor <table> is this table (exclude nested).
  const rows = Array.from(table.querySelectorAll('tr')).filter(
    (row) => row.closest('table') === table
  );

  return rows.map((row) => {
    // Only cells directly owned by this row (exclude cells of nested tables).
    const cells = Array.from(row.querySelectorAll('td, th')).filter(
      (cell) => cell.closest('tr') === row
    );
    return cells.map((cell) => ({ content: normalizeTextContent(cell.innerHTML) }));
  });
}
