import { cloneDeep } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import TableColumnTool from './tableTool';
import { getShadowRoot, useBlock, useFocusIdx } from 'easy-email-editor';

export function TableOperation() {
  const shadowRoot = getShadowRoot();
  const { focusIdx } = useFocusIdx();
  const { focusBlock, change } = useBlock();
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const tool = useRef<TableColumnTool | null>(null);

  useEffect(() => {
    // Check if shadowRoot and target container exist before proceeding
    if (!shadowRoot) return;

    const targetContainer = shadowRoot.querySelector('body');
    if (!targetContainer) {
      console.warn('Shadow DOM body not found for TableOperation');
      return;
    }

    const borderTool: any = {
      top: topRef.current,
      bottom: bottomRef.current,
      left: leftRef.current,
      right: rightRef.current,
    };

    tool.current = new TableColumnTool(borderTool, targetContainer);

    return () => {
      tool.current?.destroy();
    };
  }, [shadowRoot]);

  useEffect(() => {
    if (tool.current) {
      tool.current.changeTableData = (data: any[][]) => {
        change(`${focusIdx}.data.value.tableSource`, cloneDeep(data));
      };
      tool.current.tableData = cloneDeep(focusBlock?.data?.value?.tableSource || []);
    }
  }, [focusIdx, focusBlock, change]);

  // Don't render if shadowRoot is not available
  if (!shadowRoot) {
    return null;
  }

  const targetContainer = shadowRoot.querySelector('body');
  if (!targetContainer) {
    return null;
  }

  return (
    <>
      {createPortal(
        <div>
          <div ref={topRef} />
          <div ref={bottomRef} />
          <div ref={leftRef} />
          <div ref={rightRef} />
        </div>,
        targetContainer,
      )}
    </>
  );
}
