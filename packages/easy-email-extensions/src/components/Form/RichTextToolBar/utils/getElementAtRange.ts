/**
 * Returns the Element at the given range position.
 * Works for both collapsed ranges (cursor) and non-collapsed (selection).
 * For a collapsed range the startContainer is used; for a non-collapsed range
 * the commonAncestorContainer is used (matching previous behaviour).
 */
export function getElementAtRange(range: Range): Element | null {
  const node = range.collapsed
    ? range.startContainer
    : range.commonAncestorContainer;

  if (node instanceof Element) return node;
  if (node.parentElement) return node.parentElement;
  return null;
}

