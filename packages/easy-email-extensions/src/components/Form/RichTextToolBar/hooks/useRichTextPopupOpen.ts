import { useCallback, useEffect, useRef, useState } from 'react';

export interface PopupRect {
  triggerLeft: number;
  triggerTop: number;
  triggerWidth: number;
  triggerHeight: number;
}

/**
 * Popup open/position manager for toolbar buttons inside a Shadow DOM.
 *
 * Uses a portal-based approach:
 *  - We compute getBoundingClientRect() of the trigger button and expose it.
 *  - Callers render a fixed-position portal div in document.body at that rect.
 *  - No antd getPopupContainer tricks needed — popup is outside the shadow DOM.
 */
export function useRichTextPopupOpen() {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<PopupRect | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const popupContainerRef = useRef<HTMLElement | null>(null);
  // Keep open state accessible inside the persistent listener without re-registering
  const openRef = useRef(false);
  openRef.current = open;

  // Persistent mousedown listener — always registered, checks openRef internally.
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!openRef.current) return;

      // composedPath() gives the real path through shadow DOM boundaries,
      // unlike e.target which is retargeted at shadow root level.
      // Note: path may include non-Node entries (e.g. Window) — guard with instanceof.
      const path = e.composedPath ? e.composedPath() : [e.target as Node];
      const isNode = (el: EventTarget): el is Node => el instanceof Node;

      // Click inside the popup portal?
      const popup = popupContainerRef.current;
      if (popup && path.some(el => isNode(el) && (el === popup || popup.contains(el)))) return;

      // Click inside the shadow host that contains the trigger (toolbar)?
      const rootNode = triggerRef.current?.getRootNode();
      if (rootNode instanceof ShadowRoot) {
        const host = rootNode.host;
        if (path.some(el => isNode(el) && (el === host || host.contains(el)))) return;
      } else if (triggerRef.current) {
        const trigger = triggerRef.current;
        if (path.some(el => isNode(el) && (el === trigger || trigger.contains(el)))) return;
      }

      setOpen(false);
    };

    // Use capture so we get the event before any stopPropagation in the tree.
    document.addEventListener('mousedown', onMouseDown, true);
    return () => document.removeEventListener('mousedown', onMouseDown, true);
  }, []); // empty deps — register once, use refs for live values

  /** Call this from the trigger button's onClick. */
  const handleTriggerClick = useCallback(() => {
    setOpen(prev => {
      if (!prev && triggerRef.current) {
        const r = triggerRef.current.getBoundingClientRect();
        setRect({
          triggerLeft: r.left,
          triggerTop: r.top,
          triggerWidth: r.width,
          triggerHeight: r.height,
        });
      }
      return !prev;
    });
  }, []);

  const close = useCallback(() => setOpen(false), []);

  /** Ref for the wrapper span around the button (used for getBoundingClientRect). */
  const setTriggerRef = useCallback((el: HTMLElement | null) => {
    triggerRef.current = el;
  }, []);

  /** Ref for the portal popup container div. */
  const setPopupContainerRef = useCallback((el: HTMLElement | null) => {
    popupContainerRef.current = el;
  }, []);

  /** @deprecated kept for API compat */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onOpenChange = useCallback((_open: boolean) => {}, []);
  /** @deprecated kept for API compat */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setPopupRef = useCallback((_el: HTMLElement | null) => {}, []);
  /** @deprecated kept for API compat */
  const getPopupContainer = useCallback((): HTMLElement => document.body, []);

  return {
    open,
    setOpen,
    rect,
    close,
    handleTriggerClick,
    setTriggerRef,
    setPopupContainerRef,
    // Legacy compat
    onOpenChange,
    setPopupRef,
    getPopupContainer,
  };
}
