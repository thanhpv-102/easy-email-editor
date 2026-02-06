import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';
import { Stack, TextStyle, useBlock } from 'easy-email-editor';
import { BasicType, BlockManager } from 'easy-email-core';

export interface AttributesPanelWrapper {
  style?: React.CSSProperties;
  extra?: React.ReactNode;
  children: React.ReactNode | React.ReactElement;
}
export const AttributesPanelWrapper: React.FC<AttributesPanelWrapper> = props => {
  const { focusBlock } = useBlock();
  const block = focusBlock && BlockManager.getBlockByType(focusBlock.type);

  if (!focusBlock || !block) return null;

  return (
    <div>
      <div
        style={{
          padding: '4px 16px 12px 16px',
        }}
      >
        <Stack vertical>
          <Stack.Item fill>
            <Stack
              wrap={false}
              distribution='equalSpacing'
              alignment='center'
            >
              <Stack
                spacing='extraTight'
                alignment='center'
              >
                <EyeIcon />
                <TextStyle
                  variation='strong'
                  size='medium'
                >
                  {`${block.name} `} {t('attributes')}
                </TextStyle>
              </Stack>
              <Stack.Item>{props.extra}</Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      </div>

      <div style={{ padding: '0px', ...props.style }}>{props.children}</div>
    </div>
  );
};

function EyeIcon() {
  const { setFocusBlock, focusBlock } = useBlock();

  const onToggleVisible = useCallback(
    (e: React.MouseEvent) => {
      if (!focusBlock) return null;
      e.stopPropagation();
      setFocusBlock({
        ...focusBlock,
        data: {
          ...focusBlock.data,
          hidden: !focusBlock.data.hidden,
        },
      });
    },
    [focusBlock, setFocusBlock],
  );

  if (!focusBlock) return null;

  if (focusBlock.type === BasicType.PAGE.toString()) return null;

  return focusBlock.data.hidden ? (
    <EyeInvisibleOutlined
      style={{ cursor: 'pointer', fontSize: 16 }}
      onClick={onToggleVisible}
    />
  ) : (
    <EyeOutlined
      style={{ cursor: 'pointer', fontSize: 16 }}
      onClick={onToggleVisible}
    />
  );
}
