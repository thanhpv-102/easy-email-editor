import React, { useCallback } from 'react';

import { ToolItem } from '../ToolItem';
import { IconFont } from 'easy-email-editor';
import { useFontFamily } from '@extensions/hooks/useFontFamily';
import { useRichTextPopupOpen } from '../../hooks/useRichTextPopupOpen';
import { RichTextPortalPopup } from '../RichTextPortalPopup';

export interface FontFamilyProps {
  execCommand: (cmd: string, value: string) => void;
}

export function FontFamily(props: FontFamilyProps) {
  const { fontList } = useFontFamily();
  const { execCommand } = props;
  const { open, rect, close, handleTriggerClick, setTriggerRef, setPopupContainerRef } = useRichTextPopupOpen();

  const onChange = useCallback(
    (val: string) => {
      execCommand('fontName', val);
      close();
    },
    [execCommand, close],
  );

  return (
    <>
      <span ref={setTriggerRef}>
        <ToolItem
          title={t('Font family')}
          icon={<IconFont iconName="icon-font-family" />}
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
            maxWidth: 200,
            maxHeight: 350,
            overflowY: 'auto',
          }}
        >
          {fontList.map(item => (
            <li
              key={item.value}
              onClick={() => onChange(item.value)}
              style={{
                padding: '5px 12px',
                cursor: 'pointer',
                lineHeight: '22px',
                whiteSpace: 'nowrap',
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
