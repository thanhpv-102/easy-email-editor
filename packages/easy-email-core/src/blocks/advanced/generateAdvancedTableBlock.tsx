import { BasicType, AdvancedType } from '@core/constants';
import { IBlockData } from '@core/typings';
import { createCustomBlock } from '@core/utils/createCustomBlock';
import { BlockManager } from '@core/utils/BlockManager';
import { getParentByIdx } from '@core/utils/block';
import { merge } from 'lodash';
import React from 'react';
import { Column, Section } from '@core/components';
import { classnames } from '@core/utils/classnames';
import { getPreviewClassName } from '@core/utils/getPreviewClassName';

export function generateAdvancedTableBlock(option: {
  type: string;
  baseType: BasicType;
  validParentType: string[];
}) {
  return createCustomBlock<AdvancedTableBlock>({
    get name() {
      return 'Advanced Table';
    },
    type: option.type,
    validParentType: option.validParentType,
    create: payload => {
      const defaultData: AdvancedTableBlock = {
        type: option.type,
        data: {
          value: {
            tableSource: [
              [{ content: 'Header 1' }, { content: 'Header 2' }, { content: 'Header 3' }],
              [{ content: 'Cell 1-1' }, { content: 'Cell 1-2' }, { content: 'Cell 1-3' }],
              [{ content: 'Cell 2-1' }, { content: 'Cell 2-2' }, { content: 'Cell 2-3' }],
            ],
          },
        },
        attributes: {
          cellBorderColor: '#dddddd',
          cellPadding: '8px',
          'text-align': 'left',
          width: '100%',
        },
        children: [],
      };
      return merge(defaultData, payload);
    },
    render: params => {
      const { data, idx, mode, context } = params;

      // Create preview class for testing mode
      const previewClassName =
        mode === 'testing' && idx
          ? getPreviewClassName(idx, data.type)
          : '';

      // Convert to basic table format
      const blockData = {
        ...data,
        type: option.baseType,
        attributes: {
          ...data.attributes,
          'css-class': classnames(
            data.attributes['css-class'],
            previewClassName
          ),
        },
        data: {
          ...data.data,
          value: {
            content: generateTableHTML(data.data.value.tableSource, data.attributes),
          },
        },
      };

      const block = BlockManager.getBlockByType(blockData.type);
      if (!block) {
        throw new Error(`Can not find ${blockData.type}`);
      }

      const children = block?.render({ ...params, data: blockData, idx });

      const parentBlockData = getParentByIdx({ content: context! }, idx!);
      if (!parentBlockData) {
        return children;
      }

      if (
        parentBlockData.type === BasicType.PAGE.toString() ||
        parentBlockData.type === BasicType.WRAPPER.toString() ||
        parentBlockData.type === AdvancedType.WRAPPER.toString()
      ) {
        return (
          <Section padding='0px' text-align='left'>
            <Column>{children}</Column>
          </Section>
        );
      }

      return children;
    },
  });
}

function generateTableHTML(
  tableSource: IAdvancedTableData[][],
  attributes: AdvancedTableBlock['attributes']
): string {
  const { cellPadding, cellBorderColor, headerRow } = attributes;
  const isHeaderRow = headerRow != 'false';
  const textAlign = attributes['text-align'] || 'left';
  const fontStyle = attributes['font-style'] || 'normal';
  const fontFamily = attributes['font-family'];
  const fontSize = attributes['font-size'];
  const color = attributes.color;

  const trStyles = [
    `text-align:${textAlign}`,
    `font-style:${fontStyle}`,
  ];
  if (fontFamily) {
    trStyles.push(`font-family:${fontFamily}`);
  }
  if (fontSize) {
    trStyles.push(`font-size:${fontSize}`);
  }
  if (color) {
    trStyles.push(`color:${color}`);
  }

  const trStyleStr = trStyles.join(';');

  return tableSource
    .map((tr, rowIndex) => {
      const cells = tr
        .map((cell) => {
          const styles = [] as string[];
          if (cellPadding) {
            styles.push(`padding: ${cellPadding}`);
          }
          if (cellBorderColor) {
            styles.push(`border: 1px solid ${cellBorderColor}`);
          }
          if (cell.backgroundColor) {
            styles.push(`background-color: ${cell.backgroundColor}`);
          }

          const tag = isHeaderRow && rowIndex === 0 ? 'th' : 'td';
          const styleAttr = styles.length > 0 ? ` style="${styles.join('; ')}"` : '';
          const rowSpan = cell.rowSpan && cell.rowSpan > 1 ? ` rowspan="${cell.rowSpan}"` : '';
          const colSpan = cell.colSpan && cell.colSpan > 1 ? ` colspan="${cell.colSpan}"` : '';

          return `<${tag}${rowSpan}${colSpan}${styleAttr}>${cell.content}</${tag}>`;
        })
        .join('');

      return `<tr style="${trStyleStr}">${cells}</tr>`;
    })
    .join('');
}

export interface IAdvancedTableData {
  content: string;
  colSpan?: number;
  rowSpan?: number;
  backgroundColor?: string;
}

export type AdvancedTableBlock = IBlockData<
  {
    cellPadding?: string;
    cellBorderColor?: string;
    headerRow?: string;
    'font-style'?: string;
    'font-family'?: string;
    'font-size'?: string;
    color?: string;
    border?: string;
    'text-align'?: string;
    width?: string;
    'css-class'?: string;
  },
  {
    tableSource: IAdvancedTableData[][];
  }
>;
