import React, { useCallback } from 'react';
import { MergeTags as MergeTagsOptions } from '@extensions/AttributePanel';
import { Popover } from 'antd';
import { ToolItem } from '../ToolItem';
import { IconFont } from 'easy-email-editor';

export interface MergeTagsProps {
  execCommand: (cmd: string, value: string) => void;
  getPopupContainer: () => HTMLElement;
}

export function MergeTags(props: MergeTagsProps) {
  const { execCommand } = props;
  const [visible, setVisible] = React.useState(false);

  const onChange = useCallback(
    (val: string) => {
      execCommand('insertHTML', val);
      setVisible(false);
    },
    [execCommand],
  );

  const onVisibleChange = useCallback((v: boolean) => {
    setVisible(v);
  }, []);

  return (
    <Popover
      trigger="click"
      placement="bottomLeft"
      open={visible}
      onOpenChange={onVisibleChange}
      getPopupContainer={props.getPopupContainer}
      content={(
        <MergeTagsOptions
          value=""
          onChange={onChange}
        />
      )}
    >
      <ToolItem
        title={t('Merge tag')}
        icon={<IconFont iconName="icon-merge-tags" />}
      />
    </Popover>
  );
}
