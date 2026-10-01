import React, { useEffect } from 'react';
import { ContentEditableType, DATA_CONTENT_EDITABLE_IDX, DATA_CONTENT_EDITABLE_TYPE, getShadowRoot, useBlock } from '@thanhpv102/easy-email-editor';
import { useField, useForm } from '@thanhpv102/easy-email-editor';
import { cloneDeep, get } from 'lodash';
import { parseExcelTable, normalizeTextContent } from '../../../utils/excelParser';
import { parseCellIdx, fillTableSource } from '../../../utils/tableCellPaste';

export interface InlineTextProps {
  idx: string;
  children?: React.ReactNode;
  onChange: (content: string) => void;
}

export function InlineText({ idx, onChange, children }: InlineTextProps) {
  const {
    mutators: { setFieldTouched },
  } = useForm();

  const { values, setValueByIdx } = useBlock();

  useField(idx); // setFieldTouched will be work while register field,

  useEffect(() => {
    const shadowRoot = getShadowRoot();

    const onPaste = (e: ClipboardEvent) => {
      if (!(e.target instanceof Element) || !e.target.getAttribute('contenteditable')) return;
      e.preventDefault();

      const targetIdx = e.target.getAttribute(DATA_CONTENT_EDITABLE_IDX);
      const cell = targetIdx ? parseCellIdx(targetIdx) : null;

      const htmlData = e.clipboardData?.getData('text/html');
      const matrix = htmlData ? parseExcelTable(htmlData) : null;

      // Table-cell target with a multi-cell clipboard matrix: fill the table's
      // tableSource from the focused cell, clipped to the table's bounds.
      if (cell && matrix && (matrix.length > 1 || (matrix[0]?.length ?? 0) > 1)) {
        const block = cloneDeep(get(values, cell.tableIdx)) as any;
        if (block?.data?.value?.tableSource) {
          block.data.value.tableSource = fillTableSource(
            block.data.value.tableSource,
            matrix,
            cell.row,
            cell.col,
          );
          setValueByIdx(cell.tableIdx, block);
        }
        return;
      }

      // All other cases (non-table target, or single-cell/non-table clipboard
      // into a cell): insert normalized plain text at the selection. A focused
      // cell persists automatically because RichTextField binds a final-form
      // Field at the cell's DATA_CONTENT_EDITABLE_IDX, so onChange writes
      // straight to tableSource.r.c.content.
      const text = normalizeTextContent(htmlData || e.clipboardData?.getData('text/plain') || '');

      const selection = (shadowRoot as any)?.getSelection ? (shadowRoot as any).getSelection() : window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      const contentEditableType = e.target.getAttribute(DATA_CONTENT_EDITABLE_TYPE);
      if (contentEditableType === ContentEditableType.RichText) {
        onChange(e.target.innerHTML || '');
      } else if (contentEditableType === ContentEditableType.Text) {
        onChange(e.target.textContent?.trim() || '');
      }
    };

    const onInput = (e: Event) => {
      if (e.target instanceof Element && e.target.getAttribute('contenteditable')) {

        const contentEditableType = e.target.getAttribute(DATA_CONTENT_EDITABLE_TYPE);
        if (contentEditableType === ContentEditableType.RichText) {
          onChange(e.target.innerHTML || '');
        } else if (contentEditableType === ContentEditableType.Text) {
          onChange(e.target.textContent?.trim() || '');
        }
      }
    };

    shadowRoot.addEventListener('paste', onPaste as any, true);
    shadowRoot.addEventListener('input', onInput);

    return () => {
      shadowRoot.removeEventListener('paste', onPaste as any, true);
      shadowRoot.removeEventListener('input', onInput);
    };
  }, [onChange, setFieldTouched, values, setValueByIdx]);

  return <>{children}</>;
}
