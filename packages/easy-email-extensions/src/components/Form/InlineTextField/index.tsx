import React, { useEffect } from 'react';
import { ContentEditableType, DATA_CONTENT_EDITABLE_TYPE, getShadowRoot, useBlock, useFocusIdx } from '@thanhpv102/easy-email-editor';
import { useField, useForm } from '@thanhpv102/easy-email-editor';
import { AdvancedType, BasicType } from '@thanhpv102/easy-email-core';
import { parseExcelTable, normalizeTextContent } from '../../../utils/excelParser';
import { buildAdvancedTablePayload } from '../../../utils/buildAdvancedTablePayload';

export interface InlineTextProps {
  idx: string;
  children?: React.ReactNode;
  onChange: (content: string) => void;
}

export function InlineText({ idx, onChange, children }: InlineTextProps) {
  const {
    mutators: { setFieldTouched },
  } = useForm();

  const { focusBlock, setValueByIdx } = useBlock();
  const { focusIdx } = useFocusIdx();

  useField(idx); // setFieldTouched will be work while register field,

  useEffect(() => {
    const shadowRoot = getShadowRoot();

    const onPaste = (e: ClipboardEvent) => {
      if (!(e.target instanceof Element) || !e.target.getAttribute('contenteditable')) return;
      e.preventDefault();

      const htmlData = e.clipboardData?.getData('text/html');

      // Table branch: Excel/HTML table data drives AdvancedTable create/update.
      const matrix = htmlData ? parseExcelTable(htmlData) : null;
      if (matrix) {
        if (focusBlock?.type === AdvancedType.TABLE) {
          setValueByIdx(focusIdx, {
            ...focusBlock,
            data: {
              ...focusBlock.data,
              value: { ...focusBlock.data.value, tableSource: matrix },
            },
          });
        } else if (
          focusBlock &&
          (focusBlock.type === BasicType.TEXT || focusBlock.type === AdvancedType.TEXT)
        ) {
          // Convert the focused text block into a fresh default-styled
          // AdvancedTable in place (do not carry over the text block's
          // attributes/children).
          setValueByIdx(focusIdx, buildAdvancedTablePayload(matrix));
        }
        return;
      }

      // Non-table branch: insert normalized plain text at the selection.
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
  }, [onChange, setFieldTouched, focusBlock, focusIdx, setValueByIdx]);

  return <>{children}</>;
}
