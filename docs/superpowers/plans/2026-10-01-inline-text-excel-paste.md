# Excel Table & Data Normalization for InlineText Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make pasting into `InlineText` target-aware — a non-table target always receives normalized plain text; an `AdvancedTable` cell receives either a multi-cell fill (clipped to bounds, anchored at the focused cell) or an in-cursor text insert for a single cell — and remove the earlier behavior that converted a text block into a table.

**Architecture:** Normalization already lives in `excelParser.ts` (unchanged). Add a pure `tableCellPaste.ts` with `parseCellIdx` (reads the focused cell's row/col/table-idx from its `DATA_CONTENT_EDITABLE_IDX`) and `fillTableSource` (clipped overlay). Rewire the `InlineText` paste handler to branch on `parseCellIdx(target idx)`: table-cell + multi-cell matrix → `fillTableSource` + `setValueByIdx`; everything else → normalized text at the selection (persisting the cell's content when the target is a cell). Remove the now-dead `buildAdvancedTablePayload`.

**Tech Stack:** TypeScript, React, Jest + jsdom, `@thanhpv102/easy-email-core` (types), `@thanhpv102/easy-email-editor` (`useBlock`, `DATA_CONTENT_EDITABLE_IDX`).

**Spec:** `docs/specs/2026-10-01-inline-text-excel-paste-design.md`

## Global Constraints

- Normalization is "paste as value": no `mso-*` styles, `<style>`/`<script>`, tags, or comments survive; inline tags seamless, block/`<br>` → single space, whitespace collapsed. (Already implemented in `excelParser.ts`; this plan does not change it.)
- Cell anchor is the existing `DATA_CONTENT_EDITABLE_IDX`, shaped `"<tableBlockIdx>.data.value.tableSource.<row>.<col>.content"`. No new cell id is added. (verified: `HtmlStringToReactNodes.tsx` lines ~219-230)
- Table fills are clipped to existing bounds — the table never grows rows or columns. (spec: Out-of-bounds fill)
- Pasting into a non-table target NEVER creates or converts to a table. (spec: supersedes earlier draft)
- Block mutation uses `useBlock().setValueByIdx(idx, newBlock)` only. (verified: `useBlock.ts`)
- Tests run with `cd packages/easy-email-extensions && npx jest <pattern>` (Jest, jsdom). The repo's `pnpm --filter ... test` wrapper runs a failing install pre-check; use `npx jest` directly.

## Review Focus

- **Single Excel cell pasted into a text block** — the reported bug: must insert text, not replace the block with a table. (covered: Task 2 wiring via `parseCellIdx` → null → text path; asserted indirectly by Task 1 `test_parseCellIdx_text_block_returns_null`)
- **Multi-cell fill overrunning the table edge** — a 3×3 paste at the last row/col must drop the overflow, not throw or grow. (covered: Task 1 `test_fillTableSource_clips_past_bounds`)
- **Cell idx with bracketed path segments** — real idx is like `content.children.[0].children.[1].data.value.tableSource.2.1.content`; `parseCellIdx` must extract row=2,col=1 and the table idx intact. (covered: Task 1 `test_parseCellIdx_extracts_row_col_and_table_idx`)
- **fillTableSource must not mutate its input** — the handler reads `focusBlock`; an in-place mutation risks stale-state bugs. (covered: Task 1 `test_fillTableSource_does_not_mutate_input`)
- **Single-cell matrix into a table cell** — treated as text-at-cursor, not a 1×1 `fillTableSource` that overwrites the whole cell. (covered: Task 2 wiring; the matrix length check routes 1×1 to the text path)

---

### Task 1: Table-cell paste helpers

**Files:**
- Create: `packages/easy-email-extensions/src/utils/tableCellPaste.ts`
- Test: `packages/easy-email-extensions/src/utils/__tests__/tableCellPaste.test.ts`

**Interfaces:**
- Consumes: `IAdvancedTableData` type from `@thanhpv102/easy-email-core`.
- Produces:
  - `parseCellIdx(idx: string): { tableIdx: string; row: number; col: number } | null` — for an idx ending `.data.value.tableSource.<row>.<col>.content`, return the table block idx (everything before `.data.value.tableSource`), and numeric `row`/`col`; otherwise `null`.
  - `fillTableSource(tableSource: IAdvancedTableData[][], matrix: IAdvancedTableData[][], startRow: number, startCol: number): IAdvancedTableData[][]` — return a new matrix (input not mutated) with `matrix` overlaid starting at `[startRow][startCol]`, clipped to the original row/column counts.

- [ ] **Step 1: Write the failing tests**

```ts
// packages/easy-email-extensions/src/utils/__tests__/tableCellPaste.test.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/easy-email-extensions && npx jest tableCellPaste`
Expected: FAIL — module `../tableCellPaste` not found.

- [ ] **Step 3: Implement the helpers**

In `packages/easy-email-extensions/src/utils/tableCellPaste.ts`:
- `parseCellIdx`: match `idx` against `/^(.*)\.data\.value\.tableSource\.(\d+)\.(\d+)\.content$/`; on match return `{ tableIdx: m[1], row: Number(m[2]), col: Number(m[3]) }`, else `null`.
- `fillTableSource`: deep-copy rows/cells of `tableSource` (e.g. `tableSource.map(r => r.map(c => ({ ...c })))`), then for each `matrix[i][j]` whose target `startRow+i`/`startCol+j` is within the copy's bounds, replace that cell with `{ ...matrix[i][j] }`; return the copy.

Signatures and tests fix behavior; no code block needed beyond this.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/easy-email-extensions && npx jest tableCellPaste`
Expected: PASS (5/5).

- [ ] **Step 5: Commit**

```bash
git add packages/easy-email-extensions/src/utils/tableCellPaste.ts packages/easy-email-extensions/src/utils/__tests__/tableCellPaste.test.ts
git commit -m "feat(extensions): add table-cell paste helpers (parseCellIdx, fillTableSource)"
```

---

### Task 2: Rewire InlineText paste; remove table conversion

**Files:**
- Modify: `packages/easy-email-extensions/src/components/Form/InlineTextField/index.tsx`
- Delete: `packages/easy-email-extensions/src/utils/buildAdvancedTablePayload.ts`
- Delete: `packages/easy-email-extensions/src/utils/__tests__/buildAdvancedTablePayload.test.ts`

**Interfaces:**
- Consumes: `parseExcelTable`, `normalizeTextContent` from `../../../utils/excelParser`; `parseCellIdx`, `fillTableSource` from `../../../utils/tableCellPaste` (Task 1); `useBlock` (for `values`/`setValueByIdx`) from `@thanhpv102/easy-email-editor`; `DATA_CONTENT_EDITABLE_IDX` from `@thanhpv102/easy-email-editor`; `get`/`cloneDeep` from `lodash` for reading the table block by idx.
- Produces: nothing consumed by later tasks (terminal task).

- [ ] **Step 1: Delete the dead conversion helper and its test**

Remove `buildAdvancedTablePayload.ts` and `buildAdvancedTablePayload.test.ts`. The text→table conversion is gone from the spec; this helper has no remaining caller after Step 3.

- [ ] **Step 2: Run the suite to confirm the deletion compiles (RED/anchor)**

Run: `cd packages/easy-email-extensions && npx jest`
Expected: FAIL — `InlineTextField/index.tsx` still imports `buildAdvancedTablePayload`, so its suite/type usage breaks. This failure anchors the rewire in Step 3. (If the component is import-only and jest still passes, proceed; the type-check in Step 5 is the real gate.)

- [ ] **Step 3: Rewire `onPaste` in `InlineTextField/index.tsx`**

Replace the current table/convert/text branching with:
- Read `const targetIdx = e.target.getAttribute(DATA_CONTENT_EDITABLE_IDX)` and `const cell = targetIdx ? parseCellIdx(targetIdx) : null`.
- `const htmlData = e.clipboardData?.getData('text/html'); const matrix = htmlData ? parseExcelTable(htmlData) : null;`
- **Table-cell target with a multi-cell matrix** (`cell && matrix && (matrix.length > 1 || matrix[0]?.length > 1)`): read the table block via `get(values, cell.tableIdx)` (clone it), compute `fillTableSource(block.data.value.tableSource, matrix, cell.row, cell.col)`, write it back onto the clone's `data.value.tableSource`, call `setValueByIdx(cell.tableIdx, clone)`, then `return`.
- **All other cases** (non-table target, or single-cell/non-table clipboard into a cell): keep the existing normalized-text-at-selection insertion (`normalizeTextContent(htmlData || plain)`) and the existing `onChange` emit for RichText/Text. Persistence of a focused cell is automatic: `RichTextField` binds a final-form `<Field name={cell's DATA_CONTENT_EDITABLE_IDX}>` (= `tableSource.r.c.content`), so `InlineText.onChange(e.target.innerHTML)` writes straight to that cell. (verified: `RichTextField/index.tsx`)
- Add `useBlock()` destructuring `{ values, setValueByIdx }` and include `values`/`setValueByIdx` in the `useEffect` dep array. Remove `useFocusIdx`, `AdvancedType`/`BasicType`, and `buildAdvancedTablePayload` imports if no longer used.

The branch predicate (`matrix.length > 1 || matrix[0]?.length > 1`) is the single-vs-multi decision the spec pins; the body is wiring the Task-1 helpers to `setValueByIdx`.

- [ ] **Step 4: Run the full extensions suite**

Run: `cd packages/easy-email-extensions && npx jest`
Expected: PASS — `excelParser` and `tableCellPaste` suites green; no remaining reference to `buildAdvancedTablePayload`.

- [ ] **Step 5: Type-check the package**

Run: `cd packages/easy-email-extensions && npx tsc --noEmit -p tsconfig.json`
Expected: exit 0, no errors.

- [ ] **Step 6: Commit**

```bash
git add packages/easy-email-extensions/src/components/Form/InlineTextField/index.tsx
git rm packages/easy-email-extensions/src/utils/buildAdvancedTablePayload.ts packages/easy-email-extensions/src/utils/__tests__/buildAdvancedTablePayload.test.ts
git commit -m "feat(extensions): target-aware paste; drop text-to-table conversion"
```

---

## Notes for the executor

- `excelParser.ts` is already implemented and tested (12 passing tests). This plan does not modify it.
- The component glue has no React render test (consistent with the package). Confidence comes from the two pure helper suites plus the type-check. A component-level Shadow-DOM paste test is out of scope; ledger it as a ruling if you add one.
- Manual verification (not automatable here): single Excel cell → text block inserts text (block stays text); multi-cell range → AdvancedTable cell fills from that cell, clipped; single cell → AdvancedTable cell inserts at cursor.
