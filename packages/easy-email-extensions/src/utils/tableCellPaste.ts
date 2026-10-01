import { IAdvancedTableData } from '@thanhpv102/easy-email-core';

/**
 * Extract the table block idx and cell row/col from a cell's
 * DATA_CONTENT_EDITABLE_IDX, shaped
 * `"<tableBlockIdx>.data.value.tableSource.<row>.<col>.content"`.
 * Returns `null` when the idx is not a table-cell idx.
 */
export function parseCellIdx(
  idx: string,
): { tableIdx: string; row: number; col: number } | null {
  const m = idx.match(/^(.*)\.data\.value\.tableSource\.(\d+)\.(\d+)\.content$/);
  if (!m) return null;
  return { tableIdx: m[1], row: Number(m[2]), col: Number(m[3]) };
}

/**
 * Return a new matrix with `matrix` overlaid starting at
 * `[startRow][startCol]`, clipped to the original row/column counts.
 * The input `tableSource` is never mutated; the table never grows.
 */
export function fillTableSource(
  tableSource: IAdvancedTableData[][],
  matrix: IAdvancedTableData[][],
  startRow: number,
  startCol: number,
): IAdvancedTableData[][] {
  const out = tableSource.map((row) => row.map((cell) => ({ ...cell })));
  for (let i = 0; i < matrix.length; i++) {
    const targetRow = startRow + i;
    if (targetRow < 0 || targetRow >= out.length) continue;
    for (let j = 0; j < matrix[i].length; j++) {
      const targetCol = startCol + j;
      if (targetCol < 0 || targetCol >= out[targetRow].length) continue;
      out[targetRow][targetCol] = { ...matrix[i][j] };
    }
  }
  return out;
}
