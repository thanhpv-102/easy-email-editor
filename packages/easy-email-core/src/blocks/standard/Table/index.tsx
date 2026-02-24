import React from 'react';
import { IBlockData } from '@core/typings';
import { BasicType } from '@core/constants';
import { createBlock } from '@core/utils/createBlock';
import { merge } from 'lodash';
import { BasicBlock } from '@core/components/BasicBlock';

export type ITable = IBlockData<
  {
    align?: string;
    border?: string;
    cellpadding?: string;
    cellspacing?: string;
    color?: string;
    'container-background-color'?: string;
    'font-family'?: string;
    'font-size'?: string;
    'font-style'?: string;
    'font-weight'?: string;
    'line-height'?: string;
    'letter-spacing'?: string;
    padding?: string;
    'table-layout'?: string;
    width?: string;
  },
  {
    content?: string;
  }
>;

export const Table = createBlock<ITable>({
  get name() {
    return 'Table';
  },
  type: BasicType.TABLE,
  create: payload => {
    const defaultData: ITable = {
      type: BasicType.TABLE,
      data: {
        value: {
          content: `
            <tr>
              <th style="padding: 8px; border: 1px solid #000;">Header 1</th>
              <th style="padding: 8px; border: 1px solid #000;">Header 2</th>
              <th style="padding: 8px; border: 1px solid #000;">Header 3</th>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #000;">Cell 1</td>
              <td style="padding: 8px; border: 1px solid #000;">Cell 2</td>
              <td style="padding: 8px; border: 1px solid #000;">Cell 3</td>
            </tr>
          `.trim(),
        },
      },
      attributes: {
        width: '100%',
        align: 'left',
      },
      children: [],
    };
    return merge(defaultData, payload);
  },
  validParentType: [BasicType.COLUMN, BasicType.HERO],
  render(params) {
    const { data } = params;
    const content = data.data.value.content || '';
    return (
      <BasicBlock
        params={params}
        tag="mj-table"
      >
        {content}
      </BasicBlock>
    );
  },
});
