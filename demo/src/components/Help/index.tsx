import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip, TooltipProps } from 'antd';

export function Help(
  props: TooltipProps & Partial<{ style: Partial<React.CSSProperties> }>
) {
  return (
    <Tooltip {...{ ...props, style: undefined }}>
      <QuestionCircleOutlined style={props.style} />
    </Tooltip>
  );
}
