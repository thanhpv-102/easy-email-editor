// Table-related tags that cannot contain block-level elements like <div>
const TABLE_TAGS = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'colgroup', 'col', 'caption']);

/**
 * Returns the nearest ancestor element that can validly contain a <div>.
 * If the element itself is not a table-related tag, it is returned as-is.
 */
export function getValidPortalNode(node: HTMLElement | null): HTMLElement | null {
  if (!node) return null;
  let current: HTMLElement | null = node;
  while (current) {
    if (!TABLE_TAGS.has(current.tagName.toLowerCase())) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

