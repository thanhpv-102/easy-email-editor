import React from 'react';
import { createPortal } from 'react-dom';
import { getPluginElement, RICH_TEXT_BAR_ID, useEditorContext } from 'easy-email-editor';
import { Tools } from './components/Tools';
import styleText from './shadow-dom.scss?inline';
import { RICH_TEXT_POPUP_CONTAINER_ID } from '@extensions/constants';

export { RICH_TEXT_POPUP_CONTAINER_ID };

export function RichTextToolBar(props: { onChange: (s: string) => void; }) {
  const { initialized } = useEditorContext();
  const root = initialized && getPluginElement();

  if (!root) return null;

  return (
    <>
      {createPortal(
        <>
          <style dangerouslySetInnerHTML={{ __html: styleText }} />
          <div
            id={RICH_TEXT_BAR_ID}
            style={{
              transform: 'translate(0,0)',
              padding: '4px 8px',
              boxSizing: 'border-box',
              position: 'absolute',
              left: 8,
              top: 0,
              zIndex: 100,
              width: 'calc(100% - 16px)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                backgroundColor: '#41444d',
                height: '100%',
                width: '100%',
                left: 0,
                top: 0,
              }}
            />

            <Tools onChange={props.onChange} />
          </div>
          <div
            id={RICH_TEXT_POPUP_CONTAINER_ID}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: 0,
              height: 0,
              zIndex: 10000,
              overflow: 'visible',
            }}
          />
        </>,
        root
      )}
    </>
  );
}
