import React from 'react';
import { Tooltip, TooltipProps } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

export function Help(
  props: TooltipProps &
    Partial<{ style: Partial<React.CSSProperties> }> & {
      title: React.ReactNode;
    }
) {
  return (
    <Tooltip
      {...{ ...props, style: undefined }}
      title={props.title}
      classNames={{ root: styles.helpTooltip }}
      getPopupContainer={() => document.body}
    >
      <span style={{ cursor: 'pointer' }}>
        <QuestionCircleOutlined style={props.style} />
      </span>
    </Tooltip>
  );
}
