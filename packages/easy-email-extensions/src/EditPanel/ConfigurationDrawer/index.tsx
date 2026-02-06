import { useFocusIdx } from 'easy-email-editor';
import { Drawer } from 'antd';
import { ConfigurationPanel } from '@extensions/ConfigurationPanel';
import React, { useCallback, useMemo, useRef } from 'react';

export function ConfigurationDrawer({
  height,
  compact,
  showSourceCode,
  jsonReadOnly,
  mjmlReadOnly,
}: {
  height: string;
  compact: boolean;
  showSourceCode: boolean;
  jsonReadOnly: boolean;
  mjmlReadOnly: boolean;
}) {
  const refWrapper = useRef(null);
  const { focusIdx, setFocusIdx } = useFocusIdx();

  const onClose = useCallback(() => {
    setFocusIdx('');
  }, [setFocusIdx]);

  const visible = Boolean(focusIdx);
  return useMemo(() => {
    return (
      <>
        <div
          ref={refWrapper}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: visible ? 1 : -1,
            pointerEvents: visible ? 'auto' : 'none',
          }}
        />
        {refWrapper.current && (
          <Drawer
            title={null}
            closable={false}
            placement='right'
            styles={{ body: { padding: 0 }, wrapper: { width: '100%' } }}
            open
            getContainer={() => refWrapper.current || document.body}
            footer={null}
            onClose={onClose}
          >
            <ConfigurationPanel
              compact={compact}
              showSourceCode={showSourceCode}
              height={height}
              onBack={onClose}
              jsonReadOnly={jsonReadOnly}
              mjmlReadOnly={mjmlReadOnly}
            />
          </Drawer>
        )}
      </>
    );
  }, [visible, onClose, compact, showSourceCode, height, jsonReadOnly, mjmlReadOnly]);
}
