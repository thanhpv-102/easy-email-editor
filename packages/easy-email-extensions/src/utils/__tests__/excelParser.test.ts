import { parseExcelTable, normalizeTextContent } from '../excelParser';

const excelHtml = `
<!--StartFragment-->
<style>td { mso-number-format: General; }</style>
<table><tbody>
  <tr><td style="mso-ignore:padding"><span>A1</span></td><td><b>B1</b></td></tr>
  <tr><td>A2</td><td><!--note--> </td></tr>
</tbody></table>
<!--EndFragment-->`;

describe('parseExcelTable', () => {
  it('test_parseExcelTable_strips_mso_and_style', () => {
    const m = parseExcelTable(excelHtml);
    expect(m).not.toBeNull();
    expect(m![0]).toEqual([{ content: 'A1' }, { content: 'B1' }]);
  });

  it('test_parseExcelTable_comment_and_whitespace_cells', () => {
    const m = parseExcelTable(excelHtml);
    expect(m![1]).toEqual([{ content: 'A2' }, { content: '' }]);
  });

  it('test_parseExcelTable_returns_null_when_no_table', () => {
    expect(parseExcelTable('<p>no table here</p>')).toBeNull();
    expect(parseExcelTable('')).toBeNull();
  });

  it('test_parseExcelTable_ragged_rows', () => {
    const html = '<table><tr><td>a</td><td>b</td></tr><tr><td>c</td></tr></table>';
    const m = parseExcelTable(html);
    expect(m).toEqual([[{ content: 'a' }, { content: 'b' }], [{ content: 'c' }]]);
  });

  it('test_parseExcelTable_reads_th_cells', () => {
    const html = '<table><tr><th>H1</th><th>H2</th></tr><tr><td>v1</td><td>v2</td></tr></table>';
    const m = parseExcelTable(html);
    expect(m).toEqual([
      [{ content: 'H1' }, { content: 'H2' }],
      [{ content: 'v1' }, { content: 'v2' }],
    ]);
  });

  it('test_parseExcelTable_flattens_nested_tables', () => {
    // Spec: only top-level rows/cells are extracted; a nested table flattens
    // into its containing cell's text — no phantom rows or columns.
    const html =
      '<table><tr><td>outer<table><tr><td>inner</td></tr></table></td><td>B</td></tr></table>';
    const m = parseExcelTable(html);
    expect(m).toEqual([[{ content: 'outerinner' }, { content: 'B' }]]);
  });
});

describe('normalizeTextContent', () => {
  it('test_normalizeTextContent_strips_tags_and_comments', () => {
    expect(normalizeTextContent('<p>Hello <b>world</b><!--x--></p>')).toBe('Hello world');
  });

  it('test_normalizeTextContent_plain_passthrough_trimmed', () => {
    expect(normalizeTextContent('  plain value  ')).toBe('plain value');
  });

  it('test_normalizeTextContent_strips_body_level_style_and_script', () => {
    expect(normalizeTextContent('<body><style>td{color:red}</style>Hello</body>')).toBe('Hello');
    expect(normalizeTextContent('<script>alert(1)</script>World')).toBe('World');
  });

  it('test_normalizeTextContent_inline_tags_stay_seamless', () => {
    // Inline elements must not introduce artificial spaces.
    expect(normalizeTextContent('<p>Hello <span>world</span></p>')).toBe('Hello world');
    expect(normalizeTextContent('a<b>b</b>c')).toBe('abc');
  });

  it('test_normalizeTextContent_block_tags_and_br_separate_with_space', () => {
    // Block boundaries and <br> must not fuse adjacent text together.
    expect(normalizeTextContent('<div>A</div><div>B</div>')).toBe('A B');
    expect(normalizeTextContent('Line1<br>Line2')).toBe('Line1 Line2');
    expect(normalizeTextContent('<p>One</p><p>Two</p>')).toBe('One Two');
  });
});

describe('parseExcelTable with block-level cell content', () => {
  it('test_parseExcelTable_cell_block_content_separated', () => {
    const html = '<table><tr><td><div>A</div><div>B</div></td><td>C</td></tr></table>';
    const m = parseExcelTable(html);
    expect(m).toEqual([[{ content: 'A B' }, { content: 'C' }]]);
  });
});
