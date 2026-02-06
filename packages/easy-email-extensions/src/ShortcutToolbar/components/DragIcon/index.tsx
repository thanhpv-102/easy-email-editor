import { IconFont, BlockAvatarWrapper } from 'easy-email-editor';
import { Button } from 'antd';
import { getIconNameByBlockType } from '@extensions';
import React from 'react';
import { BlockManager, IBlockData, RecursivePartial } from 'easy-email-core';

export interface DragIconProps<T extends IBlockData> {
  type: string;
  payload?: RecursivePartial<T>;
  color: string;
}

export function DragIcon<T extends IBlockData = any>(props: DragIconProps<T>) {
  const block = BlockManager.getBlockByType(props.type);
  return (
    <BlockAvatarWrapper type={props.type} payload={props.payload}>
      <Button
        type='text'
        title={block?.name}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          width: '100%',
          height: '100%',
        }}
        icon={(
          <IconFont
            iconName={getIconNameByBlockType(props.type)}
            style={{
              fontSize: 16,
              textAlign: 'center',
              cursor: 'move',
              color: props.color,
            }}
          />
        )}
      />
    </BlockAvatarWrapper>
  );
}
