import { Select as AntSelect, SelectProps as AntSelectProps } from 'antd';
import { merge } from 'lodash';
import React from 'react';

export interface SelectProps extends AntSelectProps {
  options: Array<{ value: string; label: React.ReactNode; }>;
  onChange?: (val: string) => void;
  value: string;
}

export function Select(props: SelectProps) {
  return (
    <AntSelect
      {...props}
      classNames={{
        popup: {
          root: 'easy-email-overlay',
        },
      }}
      style={merge({ width: '100%' }, props.style)}
      value={props.value}
      onChange={props.onChange}
    >
      {props.options.map((item, index) => (
        <AntSelect.Option key={index} value={item.value}>
          {item.label}
        </AntSelect.Option>
      ))}
    </AntSelect>
  );
}
