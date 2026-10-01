import { AdvancedType } from '@thanhpv102/easy-email-core';
import type { IAdvancedTableData } from '@thanhpv102/easy-email-core';

/**
 * Build a partial AdvancedTable block payload from a normalized cell matrix.
 * Suitable for passing to createBlockDataByType / spreading into setValueByIdx.
 */
export function buildAdvancedTablePayload(
  tableSource: IAdvancedTableData[][]
): { type: string; data: { value: { tableSource: IAdvancedTableData[][] } } } {
  return {
    type: AdvancedType.TABLE,
    data: {
      value: {
        tableSource,
      },
    },
  };
}
