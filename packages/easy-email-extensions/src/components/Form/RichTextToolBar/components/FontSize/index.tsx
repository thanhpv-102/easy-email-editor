import React, { useCallback } from 'react';

import { ToolItem } from '../ToolItem';
import { IconFont } from 'easy-email-editor';
import { useRichTextPopupOpen } from '../../hooks/useRichTextPopupOpen';
import { RichTextPortalPopup } from '../RichTextPortalPopup';

const list = [
  { value: '1', label: '12px' },
  { value: '2', label: '13px' },
  { value: '3', label: '16px' },
  { value: '4', label: '18px' },
  { value: '5', label: '24px' },
  { value: '6', label: '32px' },
  { value: '7', label: '48px' },
];

export interface FontSizeProps {
  execCommand: (cmd: string, value: string) => void;
}

export function FontSize(props: FontSizeProps) {
  const { execCommand } = props;
  const { open, rect, close, handleTriggerClick, setTriggerRef, setPopupContainerRef } = useRichTextPopupOpen();

  const onChange = useCallback(
    (val: string) => {
      execCommand('fontSize', val);
      close();
    },
    [execCommand, close],
  );

  return (
    <>
      <span ref={setTriggerRef}>
        <ToolItem
          title={t('Font size')}
          icon={<IconFont iconName="icon-font-color" />}
          onClick={handleTriggerClick}
        />
      </span>
      <RichTextPortalPopup
        open={open}
        rect={rect}
        containerRef={setPopupContainerRef}
        placement="bottom"
      >
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: '4px 0',
            minWidth: 80,
            maxHeight: 350,
            overflowY: 'auto',
          }}
        >
          {list.map(item => (
            <li
              key={item.value}
              onClick={() => onChange(item.value)}
              style={{
                padding: '5px 12px',
                cursor: 'pointer',
                lineHeight: '22px',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-font-item-background, #f5f5f5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </RichTextPortalPopup>
    </>
  );
}
