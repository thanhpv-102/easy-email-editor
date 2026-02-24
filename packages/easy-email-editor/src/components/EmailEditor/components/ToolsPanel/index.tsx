import { Stack } from '@/components/UI/Stack';
import React from 'react';
import { useBlock } from '@/hooks/useBlock';
import { IconFont } from '@/components/IconFont';
import { Button } from '@/components/UI/Button';
import { useEditorConfig } from '@/components/Provider/EditorConfigProvider';

export function ToolsPanel() {
  const { redo, undo, redoable, undoable } = useBlock();
  const { openConfig } = useEditorConfig();

  return (
    <Stack>
      <Button title={t('undo')} disabled={!undoable} onClick={undo}>
        <IconFont
          iconName='icon-undo'
          style={{
            cursor: 'inherit',
            opacity: undoable ? 1 : 0.75,
          }}
        />
      </Button>

      <Button title={t('redo')} disabled={!redoable} onClick={redo}>
        <IconFont
          iconName='icon-redo'
          style={{
            cursor: 'inherit',
            opacity: redoable ? 1 : 0.75,
          }}
        />
      </Button>

      <Button title={t('Editor configuration')} onClick={openConfig}>
        <IconFont
          iconName='icon-more'
          style={{
            cursor: 'inherit',
          }}
        />
      </Button>

      <Stack.Item />
    </Stack>
  );
}


