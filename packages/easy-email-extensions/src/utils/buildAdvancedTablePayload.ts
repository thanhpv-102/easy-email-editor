import { AdvancedType, createBlockDataByType } from '@thanhpv102/easy-email-core';
import type { IAdvancedTableData, IBlockData } from '@thanhpv102/easy-email-core';

/**
 * Build a complete, default-styled AdvancedTable block carrying the given cell
 * matrix. Uses createBlockDataByType so the block gets the table's default
 * attributes (cellPadding, cellBorderColor, width, ...) and an empty children
 * array — avoiding stale attributes/children when converting a text block.
 */
export function buildAdvancedTablePayload(
  tableSource: IAdvancedTableData[][]
): IBlockData {
  const block = createBlockDataByType(AdvancedType.TABLE) as IBlockData<
    any,
    { tableSource: IAdvancedTableData[][]; }
  >;
  // Replace (not merge) tableSource: the block factory deep-merges arrays by
  // index, so assign the pasted matrix directly to overwrite the default grid.
  block.data.value.tableSource = tableSource;
  return block;
}
