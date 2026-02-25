import { ColorPicker } from '@extensions/components/Form/ColorPicker';
import { IconFont } from 'easy-email-editor';
import React, { useMemo } from 'react';
import { ToolItem } from '../../ToolItem';
import { getElementAtRange } from '../../../utils/getElementAtRange';

export function IconBgColor({ selectionRange, execCommand }: {
  selectionRange: Range | null;
  execCommand: (cmd: string, val?: string) => void;
}) {

  const color = useMemo(() => {
    if (!selectionRange) return undefined;
    const el = getElementAtRange(selectionRange);
    if (!el) return undefined;
    return getComputedStyle(el).backgroundColor;
  }, [selectionRange]);

  return (
    <ColorPicker
      label=""
      showInput={false}
      onChange={(color) => execCommand('hiliteColor', color)}
      inRichTextBar
    >
      <ToolItem
        icon={(
          <div style={{ position: 'relative' }}>
            <IconFont size={12} iconName="icon-bg-color" style={{ position: 'relative', top: '-1px' }} />
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
        title={t('Background color')}
      />
    </ColorPicker>
  );
}
