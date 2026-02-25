import { ColorPicker } from '@extensions/components/Form/ColorPicker';
import { IconFont } from 'easy-email-editor';
import React, { useMemo } from 'react';
import { ToolItem } from '../../ToolItem';
import { getElementAtRange } from '../../../utils/getElementAtRange';

export function IconFontColor({ selectionRange, execCommand }: {
  selectionRange: Range | null;
  execCommand: (cmd: string, val?: string) => void;
}) {

  const color = useMemo(() => {
    if (!selectionRange) return undefined;
    const el = getElementAtRange(selectionRange);
    if (!el) return undefined;
    return getComputedStyle(el).color;
  }, [selectionRange]);

  return (
    <ColorPicker
      label=""
      onChange={(color) => execCommand('foreColor', color)}
      showInput={false}
      inRichTextBar
    >
      <ToolItem
        icon={(
          <div style={{ position: 'relative' }}>
            <IconFont size={12} iconName="icon-font-color" style={{ position: 'relative', top: '-1px' }} />
            <div style={{
              borderBottom: `2px solid ${color}`,
              position: 'absolute',
              width: '130%',
              left: '-15%',
              top: 16,
            }}
            />
          </div>
        )}
        title={t('Text color')}
      />
    </ColorPicker>
  );
}
