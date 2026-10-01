import { parseCellIdx, fillTableSource } from '../tableCellPaste';

describe('parseCellIdx', () => {
  it('test_parseCellIdx_extracts_row_col_and_table_idx', () => {
    const idx = 'content.children.[0].children.[1].data.value.tableSource.2.1.content';
    expect(parseCellIdx(idx)).toEqual({
      tableIdx: 'content.children.[0].children.[1]',
      row: 2,
      col: 1,
    });
  });

  it('test_parseCellIdx_text_block_returns_null', () => {
    expect(parseCellIdx('content.children.[0].data.value.content')).toBeNull();
    expect(parseCellIdx('')).toBeNull();
  });
});

describe('fillTableSource', () => {
  const base = () => [
    [{ content: 'a' }, { content: 'b' }],
    [{ content: 'c' }, { content: 'd' }],
  ];

  it('test_fillTableSource_overlays_at_offset', () => {
    const out = fillTableSource(base(), [[{ content: 'X' }]], 1, 1);
    expect(out).toEqual([
      [{ content: 'a' }, { content: 'b' }],
      [{ content: 'c' }, { content: 'X' }],
    ]);
  });

  it('test_fillTableSource_clips_past_bounds', () => {
    const out = fillTableSource(
      base(),
      [[{ content: 'X' }, { content: 'Y' }], [{ content: 'Z' }, { content: 'W' }]],
      1,
      1,
    );
    expect(out).toEqual([
      [{ content: 'a' }, { content: 'b' }],
      [{ content: 'c' }, { content: 'X' }],
    ]);
  });

  it('test_fillTableSource_does_not_mutate_input', () => {
    const input = base();
    fillTableSource(input, [[{ content: 'X' }]], 0, 0);
    expect(input[0][0]).toEqual({ content: 'a' });
  });
});
