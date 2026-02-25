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
    const getSelectionFromShadowRoot = (shadowRoot: ShadowRoot): Selection | null => {
      // Chrome supports getSelection() directly on ShadowRoot.
      if ('getSelection' in shadowRoot) {
        return (shadowRoot as unknown as Document).getSelection();
      }
      // Firefox: use document.getSelection() but only when the anchor is
      // actually inside the shadow root (avoids stale light-DOM selections).
      const sel = document.getSelection();
      if (sel && sel.rangeCount > 0 && shadowRoot.contains(sel.anchorNode)) {
        return sel;
      }
      return sel;
    };

    const applySelection = (shadowRoot: ShadowRoot) => {
      try {
        const selection = getSelectionFromShadowRoot(shadowRoot);

        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        if (!range) return;

        // Ignore selections whose container is outside the shadow root.
        // This prevents stale light-DOM selections in Firefox from being used.
        if (!shadowRoot.contains(range.commonAncestorContainer)) return;

        const toolbar = shadowRoot.getElementById(RICH_TEXT_TOOL_BAR);
        if (toolbar && toolbar.contains(range.commonAncestorContainer)) return;
        const popupContainer = shadowRoot.getElementById(RICH_TEXT_POPUP_CONTAINER_ID);
        if (popupContainer && popupContainer.contains(range.commonAncestorContainer)) return;

        // If the range is collapsed (cursor only), make sure the active element
        // is still the contenteditable editor – not a toolbar control or popup
        // input that stole focus and left a stale collapsed range in the editor.
        if (range.collapsed) {
          const activeEl = shadowRoot.activeElement;
          if (activeEl) {
            if (toolbar && toolbar.contains(activeEl)) return;
            if (popupContainer && popupContainer.contains(activeEl)) return;
          }
        }

        setSelectionRange(range);
      } catch {}
    };

    const shadowRoot = getShadowRoot();

    // --- Mouse tracking ---
    // We track clicks to distinguish:
    //   single-click drag  → read on mouseup (via 0ms timeout)
    //   double-click       → read via dblclick AFTER Firefox expands word selection
    let isMouseDown = false;
    let pendingDblClickTimer: ReturnType<typeof setTimeout> | null = null;
    // Flag set between mouseup and dblclick to suppress selectionchange during
    // that window (Firefox fires selectionchange with wrong ranges here).
    let suppressSelectionChange = false;

    const onMouseDown = (e: Event) => {
      const target = e.target as Node | null;
      const toolbar = shadowRoot.getElementById(RICH_TEXT_TOOL_BAR);
      const popupContainer = shadowRoot.getElementById(RICH_TEXT_POPUP_CONTAINER_ID);
      if ((toolbar && target && toolbar.contains(target)) ||
          (popupContainer && target && popupContainer.contains(target))) {
        return;
      }
      isMouseDown = true;
      suppressSelectionChange = false;
    };

    const onMouseUp = (e: Event) => {
      isMouseDown = false;
      // If the click is on the toolbar or a popup container, skip updating the
      // selection – we want to preserve the cursor/selection in the editor.
      const target = e.target as Node | null;
      const toolbar = shadowRoot.getElementById(RICH_TEXT_TOOL_BAR);
      const popupContainer = shadowRoot.getElementById(RICH_TEXT_POPUP_CONTAINER_ID);
      if ((toolbar && target && toolbar.contains(target)) ||
          (popupContainer && target && popupContainer.contains(target))) {
        return;
      }
      // Suppress selectionchange briefly after mouseup in case a dblclick
      // follows – Firefox fires bad intermediate selectionchange events in
      // the gap between mouseup and dblclick.
      suppressSelectionChange = true;
      pendingDblClickTimer = setTimeout(() => {
        pendingDblClickTimer = null;
        suppressSelectionChange = false;
        applySelection(shadowRoot);
      }, 0);
    };

    const onDblClick = (e: Event) => {
      // Cancel the mouseup timer – we handle the selection here instead.
      if (pendingDblClickTimer !== null) {
        clearTimeout(pendingDblClickTimer);
        pendingDblClickTimer = null;
      }

      // Firefox-specific workaround: when the user double-clicks inside an
      // <a> element that is itself inside a contenteditable, Firefox sometimes
      // selects the text node *before* the <a> rather than the text inside it.
      // Detect this and manually build a correct selection for the <a> content.
      const target = e.target as Node | null;
      const anchorEl = target instanceof HTMLAnchorElement
        ? target
        : (target as Element | null)?.closest?.('a') ?? null;

      if (anchorEl && anchorEl.firstChild) {
        try {
          const sel = document.getSelection();
          if (sel) {
            // Check if Firefox gave us a bad selection (anchor outside <a>).
            const isBadSelection =
              sel.rangeCount === 0 ||
              !anchorEl.contains(sel.anchorNode);

            if (isBadSelection) {
              suppressSelectionChange = false;
              // Manually select all text inside the <a> element.
              // Prefer setBaseAndExtent (supported in Firefox and Chrome) for
              // selecting nodes inside shadow DOM, as addRange can be unreliable.
              const firstChild = anchorEl.firstChild;
              const lastChild = anchorEl.lastChild ?? firstChild;
              const endOffset =
                lastChild.nodeType === Node.TEXT_NODE
                  ? (lastChild as Text).length
                  : (lastChild as Element).childNodes.length;
              if (typeof sel.setBaseAndExtent === 'function') {
                sel.setBaseAndExtent(firstChild, 0, lastChild, endOffset);
              } else {
                const newRange = document.createRange();
                newRange.selectNodeContents(anchorEl);
                sel.removeAllRanges();
                sel.addRange(newRange);
              }
              applySelection(shadowRoot);
              return;
            }
          }
        } catch {}
      }

      // Use a short delay: Firefox finishes word-boundary expansion of a
      // double-click selection right around the dblclick event, but reading
      // immediately can still catch an intermediate state.
      setTimeout(() => {
        suppressSelectionChange = false;
        applySelection(shadowRoot);
      }, 0);
    };

    const onSelectionChange = () => {
      // Suppress during mouse-down or during the mouseup→dblclick window.
      if (isMouseDown || suppressSelectionChange) return;
      applySelection(shadowRoot);
    };

    // mousedown / mouseup / dblclick on the shadow root for mouse selections.
    shadowRoot?.addEventListener('mousedown', onMouseDown);
    shadowRoot?.addEventListener('mouseup', onMouseUp);
    shadowRoot?.addEventListener('dblclick', onDblClick);

    // selectionchange handles keyboard-driven selections (shift+arrows, etc.)
    document.addEventListener('selectionchange', onSelectionChange);
    shadowRoot?.addEventListener('selectionchange', onSelectionChange);

    return () => {
      if (pendingDblClickTimer !== null) clearTimeout(pendingDblClickTimer);
      shadowRoot?.removeEventListener('mousedown', onMouseDown);
      shadowRoot?.removeEventListener('mouseup', onMouseUp);
      shadowRoot?.removeEventListener('dblclick', onDblClick);
      document.removeEventListener('selectionchange', onSelectionChange);
      shadowRoot?.removeEventListener('selectionchange', onSelectionChange);
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
