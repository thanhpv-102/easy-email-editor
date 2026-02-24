import React from 'react';
import { Stack } from 'easy-email-editor';
import { AdvancedType } from 'easy-email-core';

import { BlockMaskWrapper } from '@extensions/ShortcutToolbar/components/BlockMaskWrapper';

const tableList = [
  {
    txtName: 'Table 3x3',
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
        cellBorderColor: '#000000',
        cellPadding: '8px',
        'text-align': 'center',
      },
      children: [],
    },
  },
  {
    txtName: 'Table 4x4',
    payload: {
      type: AdvancedType.TABLE,
      data: {
        value: {
          tableSource: [
            [{ content: 'header1' }, { content: 'header2' }, { content: 'header3' }, { content: 'header4' }],
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

              <div style={{ width: '100%', paddingLeft: 20 }}>
                {item.txtName}
              </div>

            </BlockMaskWrapper>
          );
        })}
      </Stack>
    </Stack.Item>
  );
}
