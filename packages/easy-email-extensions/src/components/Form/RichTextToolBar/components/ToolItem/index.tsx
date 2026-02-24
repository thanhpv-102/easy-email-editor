import { classnames } from '@extensions/utils/classnames';
import React, { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const FIXED_CONTAINER_ID = 'FIXED_CONTAINER_ID';

interface TooltipState {
  visible: boolean;
  left: number;
  top: number;
}

function SimpleTooltip({ title, children }: { title: string; children: React.ReactElement }) {
  const [tip, setTip] = useState<TooltipState>({ visible: false, left: 0, top: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setTip({ visible: true, left: rect.left + rect.width / 2, top: rect.bottom + 6 });
    }, 400);
  }, []);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTip(prev => ({ ...prev, visible: false }));
  }, []);

  const container = document.getElementById(FIXED_CONTAINER_ID) ?? document.body;

  return (
    <>
      {React.cloneElement(children, { onMouseEnter: show, onMouseLeave: hide } as React.HTMLAttributes<HTMLElement>)}
      {tip.visible && createPortal(
        <div style={{
          position: 'fixed',
          left: tip.left,
          top: tip.top,
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.75)',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: 4,
          fontSize: 12,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 99999,
        }}>
          {title}
        </div>,
        container,
      )}
    </>
  );
}

export const ToolItem: React.FC<{
  title?: string;
  icon: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  trigger?: string;
  style?: React.CSSProperties;
  isActive?: boolean;
  getPopupContainer?: () => HTMLElement;
}> = props => {
  const btn = (
    <button
      tabIndex={-1}
      className={classnames('easy-email-extensions-emailToolItem', props.isActive && 'easy-email-extensions-emailToolItem-active')}
      onClick={props.onClick}
      style={props.style}
    >
      {props.icon}
    </button>
  );

  if (!props.title) {
    return btn;
  }

  return <SimpleTooltip title={props.title}>{btn}</SimpleTooltip>;
};
