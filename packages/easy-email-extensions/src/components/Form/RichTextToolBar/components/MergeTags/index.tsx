import React, { useCallback } from 'react';
import { MergeTags as MergeTagsOptions } from '@extensions/AttributePanel';
import { ToolItem } from '../ToolItem';
import { IconFont } from 'easy-email-editor';
import { useRichTextPopupOpen } from '../../hooks/useRichTextPopupOpen';
import { RichTextPortalPopup } from '../RichTextPortalPopup';

export interface MergeTagsProps {
  execCommand: (cmd: string, value: string) => void;
}

export function MergeTags(props: MergeTagsProps) {
  const { execCommand } = props;
  const { open, rect, close, handleTriggerClick, setTriggerRef, setPopupContainerRef } = useRichTextPopupOpen();

  const onChange = useCallback(
    (val: string) => {
      execCommand('insertHTML', val);
      close();
    },
    [execCommand, close],
  );

  return (
    <>
      <span ref={setTriggerRef}>
        <ToolItem
          title={t('Merge tag')}
          icon={<IconFont iconName="icon-merge-tags" />}
          onClick={handleTriggerClick}
        />
      </span>
      <RichTextPortalPopup
        open={open}
        rect={rect}
        containerRef={setPopupContainerRef}
        placement="bottom"
      >
        <MergeTagsOptions value="" onChange={onChange} />
      </RichTextPortalPopup>
    </>
  );
}
