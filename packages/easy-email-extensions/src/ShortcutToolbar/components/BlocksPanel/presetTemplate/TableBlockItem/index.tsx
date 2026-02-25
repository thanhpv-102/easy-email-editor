import React from 'react';
import { Stack } from 'easy-email-editor';
import { AdvancedType } from 'easy-email-core';

import { BlockMaskWrapper } from '@extensions/ShortcutToolbar/components/BlockMaskWrapper';
import { getImg } from '@/utils/getImg';
import { Picture } from '@extensions/ShortcutToolbar/components/Picture';

const tableList = [
  {
    txtName: 'Table 3x3',
    thumbnail: getImg('IMAGE_72'),
    payload: {
      type: AdvancedType.TABLE,
      data: {
        value: {
          tableSource: [
            [{ content: 'header1' }, { content: 'header2' }, { content: 'header3' }],
            [{ content: 'body1-1' }, { content: 'body1-2' }, { content: 'body1-3' }],
            [{ content: 'body2-1' }, { content: 'body2-2' }, { content: 'body2-3' }],
          ],
        },
      },
      attributes: {
        cellBorderColor: null,
        cellPadding: '8px',
        'text-align': 'center',
      },
      children: [],
    },
  },
  {
    txtName: 'Table 4x4',
    thumbnail: getImg('IMAGE_73'),
    payload: {
      type: AdvancedType.TABLE,
      data: {
        value: {
          tableSource: [
            [{
              content: '<font color="#ffffff">header1</font>',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#62a0ea',
            },
              {
                content: '<font color="#ffffff">header2</font>',
                top: 0,
                bottom: 0,
                left: 1,
                right: 1,
                backgroundColor: '#62a0ea',
              },
              {
                content: '<font color="#ffffff">header3</font>',
                top: 0,
                bottom: 0,
                left: 2,
                right: 2,
                backgroundColor: '#62a0ea',
              },
              {
                content: '<font color="#ffffff">header4</font>',
                top: 0,
                bottom: 0,
                left: 3,
                right: 3,
                backgroundColor: '#62a0ea',
              }],
            [{ content: 'body1-1' }, { content: 'body1-2' }, { content: 'body1-3' }, { content: 'body1-4' }],
            [{ content: 'body2-1' }, { content: 'body2-2' }, { content: 'body2-3' }, { content: 'body2-4' }],
            [{ content: 'body3-1' }, { content: 'body3-2' }, { content: 'body3-3' }, { content: 'body3-4' }],
          ],
        },
      },
      attributes: {
        cellBorderColor: '#9b9b9b',
        cellPadding: '8px',
        'text-align': 'left',
      },
      children: [],
    },
  },
];

export function TableBlockItem() {
  return (
    <Stack.Item fill>
      <Stack vertical>
        {tableList.map((item, index) => {
          return (
            <BlockMaskWrapper
              key={index}
              type={AdvancedType.TABLE}
              payload={item.payload}
            >

              <div style={{ position: 'relative' }}>
                <Picture src={item.thumbnail} style={{ minWidth: 250, minHeight: 70 }} />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                  }}
                />
              </div>

            </BlockMaskWrapper>
          );
        })}
      </Stack>
    </Stack.Item>
  );
}
