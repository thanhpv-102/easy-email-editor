/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useCallback, useContext } from 'react';
import { SelectionRangeContext } from '@extensions/AttributePanel/components/provider/SelectionRangeProvider';
import { getShadowRoot } from 'easy-email-editor';

/** Get the active Selection, preferring the ShadowRoot's own getSelection (Chrome)
 *  and falling back to document.getSelection() (Firefox). */
function getActiveSelection(shadowRoot: ShadowRoot): Selection | null {
  if ('getSelection' in shadowRoot) {
    return (shadowRoot as unknown as Document).getSelection();
  }
  return document.getSelection();
}

export function useSelectionRange() {
  const { selectionRange, setSelectionRange } = useContext(
    SelectionRangeContext
  );

  const restoreRange = useCallback((range: Range) => {
    const shadowRoot = getShadowRoot();
    const selection = getActiveSelection(shadowRoot);
    if (!selection) return;
    // setBaseAndExtent is the most reliable way to set a selection that spans
    // nodes inside a Shadow DOM in Firefox.
    if (typeof selection.setBaseAndExtent === 'function') {
      selection.setBaseAndExtent(
        range.startContainer,
        range.startOffset,
        range.endContainer,
        range.endOffset,
      );
    } else {
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.setStart(range.startContainer, range.startOffset);
      newRange.setEnd(range.endContainer, range.endOffset);
      selection.addRange(newRange);
    }
  }, []);

  const setRangeByElement = useCallback(
    (element: ChildNode) => {
      const shadowRoot = getShadowRoot();
      const selection = getActiveSelection(shadowRoot);
      if (!selection) return;

      const newRange = document.createRange();
      newRange.selectNode(element);
      setSelectionRange(newRange);

      if (typeof selection.setBaseAndExtent === 'function') {
        selection.setBaseAndExtent(
          newRange.startContainer,
          newRange.startOffset,
          newRange.endContainer,
          newRange.endOffset,
        );
      } else {
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    },
    [setSelectionRange]
  );

  return {
    selectionRange,
    setSelectionRange,
    restoreRange,
    setRangeByElement,
  };
}
