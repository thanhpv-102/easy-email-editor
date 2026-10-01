import React, { useEffect } from 'react';
import { ContentEditableType, DATA_CONTENT_EDITABLE_TYPE, getShadowRoot } from '@thanhpv102/easy-email-editor';
import { useField, useForm } from '@thanhpv102/easy-email-editor';

export interface InlineTextProps {
  idx: string;
  children?: React.ReactNode;
  onChange: (content: string) => void;
}

export function InlineText({ idx, onChange, children }: InlineTextProps) {
  const {
    mutators: { setFieldTouched },
  } = useForm();

  useField(idx); // setFieldTouched will be work while register field,

  useEffect(() => {
    const shadowRoot = getShadowRoot();

    const onPaste = (e: ClipboardEvent) => {
      if (!(e.target instanceof Element) || !e.target.getAttribute('contenteditable')) return;
      e.preventDefault();

      let text = '';
      const htmlData = e.clipboardData?.getData('text/html');
      if (htmlData) {
        const parsedDoc = new DOMParser().parseFromString(htmlData, 'text/html');
        const walker = parsedDoc.createTreeWalker(parsedDoc.body, NodeFilter.SHOW_COMMENT);
        const comments: Node[] = [];
        while (walker.nextNode()) comments.push(walker.currentNode);
        comments.forEach((c) => c.parentNode?.removeChild(c));

        text = parsedDoc.body.textContent || '';
      } else {
        text = e.clipboardData?.getData('text/plain') || '';
      }

      text = text.replace(/<!--[\s\S]*?-->/g, '');

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
  }, [onChange, setFieldTouched]);

  return <>{children}</>;
}
