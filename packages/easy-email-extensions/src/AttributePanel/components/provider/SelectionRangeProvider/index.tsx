/* eslint-disable @typescript-eslint/no-unsafe-call */
import { RICH_TEXT_TOOL_BAR, RICH_TEXT_POPUP_CONTAINER_ID } from '@extensions/constants';
import { getShadowRoot } from 'easy-email-editor';
import React, { useEffect, useMemo, useState } from 'react';

export const SelectionRangeContext = React.createContext<{
  selectionRange: Range | null;
  setSelectionRange: React.Dispatch<React.SetStateAction<Range | null>>;
}>({
  selectionRange: null,
  setSelectionRange: () => {},
});

export const SelectionRangeProvider: React.FC<{
  children: React.ReactNode | React.ReactElement;
}> = props => {
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);

  useEffect(() => {
    const onSelectionChange = () => {
      try {
        // Chrome supports getSelection() on ShadowRoot for selections inside Shadow DOM.
        // Firefox does not, so we fall back to document.getSelection().
        const shadowRoot = getShadowRoot();
        const selection: Selection | null =
          'getSelection' in shadowRoot
            ? (shadowRoot as unknown as Document).getSelection()
            : document.getSelection();

        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        if (!range || range.collapsed) return;

        const toolbar = shadowRoot.getElementById(RICH_TEXT_TOOL_BAR);
        if (toolbar && toolbar.contains(range.commonAncestorContainer)) return;
        const popupContainer = shadowRoot.getElementById(RICH_TEXT_POPUP_CONTAINER_ID);
        if (popupContainer && popupContainer.contains(range.commonAncestorContainer)) return;
        setSelectionRange(range);
      } catch (error) {}
    };

    document.addEventListener('selectionchange', onSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, []);

  const value = useMemo(() => {
    return {
      selectionRange,
      setSelectionRange,
    };
  }, [selectionRange]);

  return useMemo(() => {
    return (
      <SelectionRangeContext.Provider value={value}>
        {props.children}
      </SelectionRangeContext.Provider>
    );
  }, [props.children, value]);
};
