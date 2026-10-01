import { buildAdvancedTablePayload } from '../buildAdvancedTablePayload';
import { AdvancedType } from '@thanhpv102/easy-email-core';

describe('buildAdvancedTablePayload', () => {
  it('test_builds_advanced_table_payload_from_matrix', () => {
    const matrix = [[{ content: 'A' }, { content: 'B' }], [{ content: 'C' }, { content: 'D' }]];
    const payload = buildAdvancedTablePayload(matrix);
    expect(payload.type).toBe(AdvancedType.TABLE);
    expect(payload.data.value.tableSource).toEqual(matrix);
  });
});
