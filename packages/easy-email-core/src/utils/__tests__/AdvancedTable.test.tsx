import { BlockManager } from '@core/utils';
import { AdvancedType, BasicType } from '@core/constants';
import { JsonToMjml } from '..';
import { advancedBlocks, standardBlocks } from '@core/blocks';

describe('Test AdvancedTable headerRow attribute reproduction', () => {
  BlockManager.registerBlocks({ ...standardBlocks, ...advancedBlocks });

  const AdvancedTable = BlockManager.getBlockByType(AdvancedType.TABLE);

  it('should render header row by default (isHeaderRow=true)', () => {
    if (!AdvancedTable) throw new Error('AdvancedTable not found');
    const tableData = AdvancedTable.create({
      data: {
        value: {
          tableSource: [
            [{ content: 'Header 1' }],
            [{ content: 'Cell 1' }],
          ],
        },
      },
    });

    const mjml = JsonToMjml({
      data: {
        type: BasicType.PAGE,
        data: { value: {} },
        attributes: {},
        children: [tableData],
      },
      mode: 'production',
    });

    expect(mjml).toContain('>Header 1</th>');
    expect(mjml).toContain('>Cell 1</td>');
  });

  it('reproduce: should NOT render th when headerRow is "false"', () => {
    if (!AdvancedTable) throw new Error('AdvancedTable not found');
    const tableData = AdvancedTable.create({
      data: {
        value: {
          tableSource: [
            [{ content: 'Header 1' }],
            [{ content: 'Cell 1' }],
          ],
        },
      },
      attributes: {
        headerRow: 'false',
      },
    });

    const mjml = JsonToMjml({
      data: {
        type: BasicType.PAGE,
        data: { value: {} },
        attributes: {},
        children: [tableData],
      },
      mode: 'production',
    });

    expect(mjml).not.toContain('>Header 1</th>');
    expect(mjml).toContain('>Header 1</td>');
    expect(mjml).toContain('>Cell 1</td>');
  });

  it('should apply validParentType from block configuration', () => {
    if (!AdvancedTable) throw new Error('AdvancedTable not found');
    expect(AdvancedTable.validParentType).toEqual([
      BasicType.PAGE,
      BasicType.COLUMN,
      BasicType.WRAPPER,
      AdvancedType.COLUMN,
      AdvancedType.SECTION,
    ]);
  });

  it('should render font-family, font-size, and color in tr inline styles', () => {
    if (!AdvancedTable) throw new Error('AdvancedTable not found');
    const tableData = AdvancedTable.create({
      data: {
        value: {
          tableSource: [
            [{ content: 'Styled Cell' }],
          ],
        },
      },
      attributes: {
        'font-family': 'Arial',
        'font-size': '16px',
        color: '#ff0000',
      },
    });

    const mjml = JsonToMjml({
      data: {
        type: BasicType.PAGE,
        data: { value: {} },
        attributes: {},
        children: [tableData],
      },
      mode: 'production',
    });

    expect(mjml).toContain('font-family:Arial');
    expect(mjml).toContain('font-size:16px');
    expect(mjml).toContain('color:#ff0000');
  });
});
