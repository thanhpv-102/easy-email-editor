import React from 'react';
import { createPortal } from 'react-dom';
import type { PopupRect } from '../../hooks/useRichTextPopupOpen';

// This ID is defined in easy-email-editor and is whitelisted in MjmlDomRender's
// click-outside handler, so clicks inside our popup won't trigger setIsTextFocus(false).
const FIXED_CONTAINER_ID = 'FIXED_CONTAINER_ID';

interface RichTextPortalPopupProps {
  open: boolean;
  rect: PopupRect | null | undefined;
  children: React.ReactNode;
  containerRef?: (el: HTMLElement | null) => void;
  /** 'bottom' places popup below trigger; 'top' places it above. Default: 'bottom' */
  placement?: 'bottom' | 'top';
}

/**
 * Renders children into a fixed-position portal inside FIXED_CONTAINER_ID,
 * positioned relative to the trigger button rect.
 * Using FIXED_CONTAINER_ID keeps us in the whitelist of MjmlDomRender's
 * click handler so the RichText toolbar stays visible while the popup is open.
 */
export function RichTextPortalPopup({
  open,
  rect,
  children,
  containerRef,
  placement = 'bottom',
}: RichTextPortalPopupProps) {
  if (!open || !rect) return null;

  const container = document.getElementById(FIXED_CONTAINER_ID) ?? document.body;

  const GAP = 4;
  const style: React.CSSProperties = {
    position: 'fixed',
    zIndex: 10000,
    left: rect.triggerLeft,
    ...(placement === 'bottom'
      ? { top: rect.triggerTop + rect.triggerHeight + GAP }
      : { bottom: window.innerHeight - rect.triggerTop + GAP }),
    backgroundColor: 'var(--color-bg-popup)',
    borderRadius: 8,
    border: '1px solid var(--color-border)',
  };

  return createPortal(
    <div ref={containerRef} style={style}>
      {children}
    </div>,
    container,
  );
}
