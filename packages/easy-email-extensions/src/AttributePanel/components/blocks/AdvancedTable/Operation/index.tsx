import { cloneDeep } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import TableColumnTool, { IBorderTool } from './tableTool';
import { getShadowRoot, useBlock, useFocusIdx } from 'easy-email-editor';
import { IAdvancedTableData, AdvancedType } from 'easy-email-core';

export function TableOperation() {
  const shadowRoot = getShadowRoot();
  const { focusIdx } = useFocusIdx();
  const { focusBlock, change } = useBlock();
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const tool = useRef<TableColumnTool | null>(null);

  // Only show for AdvancedTable blocks
  const isAdvancedTable = focusBlock?.type === AdvancedType.TABLE;

  useEffect(() => {
    if (!isAdvancedTable) return;

    // Check if shadowRoot exists before proceeding
    if (!shadowRoot) return;
    // Use the shadow root itself as the container, not looking for a body element
    const targetContainer = shadowRoot;
    if (!targetContainer) {
      console.warn('Shadow DOM not found for TableOperation');
      return;
    }
    // Ensure all refs are available before creating the tool
    const top = topRef.current;
    const bottom = bottomRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!top || !bottom || !left || !right) {
      return;
    }
    // TypeScript now knows these are non-null HTMLDivElements
    const borderTool: IBorderTool = {
      top: top as HTMLElement,
      bottom: bottom as HTMLElement,
      left: left as HTMLElement,
      right: right as HTMLElement,
    };
    tool.current = new TableColumnTool(borderTool, targetContainer);
    return () => {
      tool.current?.destroy();
    };
  }, [shadowRoot, isAdvancedTable]);

  useEffect(() => {
    if (!isAdvancedTable) return;

    if (tool.current) {
      tool.current.changeTableData = (data: IAdvancedTableData[][]) => {
        change(`${focusIdx}.data.value.tableSource`, cloneDeep(data));
      };
      tool.current.tableData = cloneDeep(focusBlock?.data?.value?.tableSource || []);
    }
  }, [focusIdx, focusBlock, change, isAdvancedTable]);

  // Don't render if shadowRoot is not available or not an AdvancedTable
  if (!shadowRoot || !isAdvancedTable) {
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
        shadowRoot as DocumentFragment,
      )}
    </>
  );
}
