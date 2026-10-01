import { buildAdvancedTablePayload } from '../buildAdvancedTablePayload';
import { AdvancedType, BlockManager, standardBlocks, advancedBlocks } from '@thanhpv102/easy-email-core';

describe('buildAdvancedTablePayload', () => {
  BlockManager.registerBlocks({ ...standardBlocks, ...advancedBlocks });

  it('test_builds_advanced_table_payload_from_matrix', () => {
    const matrix = [[{ content: 'A' }, { content: 'B' }], [{ content: 'C' }, { content: 'D' }]];
    const payload = buildAdvancedTablePayload(matrix);
    expect(payload.type).toBe(AdvancedType.TABLE);
    expect(payload.data.value.tableSource).toEqual(matrix);
  });

  it('test_builds_full_block_with_default_table_attributes', () => {
    // The payload must be a complete default-styled AdvancedTable block so a
    // text->table conversion renders with borders/padding, not stale text attrs.
    const matrix = [[{ content: 'A' }]];
    const payload = buildAdvancedTablePayload(matrix);
    expect(payload.attributes).toMatchObject({
      cellBorderColor: '#dddddd',
      cellPadding: '8px',
      width: '100%',
    });
    expect(payload.children).toEqual([]);
  });
});
