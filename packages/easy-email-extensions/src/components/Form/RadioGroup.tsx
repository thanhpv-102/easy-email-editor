import { Radio } from 'antd';
import type { RadioGroupProps as AntdRadioGroupProps } from 'antd';
import { merge } from 'lodash';
import React from 'react';
import { Stack } from 'easy-email-editor';

export interface RadioGroupProps extends Omit<AntdRadioGroupProps, 'onChange' | 'value' | 'options'> {
  options: Array<{ value: string; label: React.ReactNode }>;
  onChange?: (value: string) => void;
  value?: string;
  type?: 'radio' | 'button';
  vertical?: boolean;
}

export function RadioGroup(props: RadioGroupProps) {
  const { vertical, options, onChange, value, style, ...rest } = props;

  return (
    <Radio.Group
      {...rest}
      style={merge({ width: '100%' }, style)}
      value={value}
      onChange={(e) => onChange?.(String(e.target.value))}
    >
      <Stack vertical={vertical} spacing='extraTight'>
        {options.map((item, index) => (
          <Radio key={index} value={item.value}>
            {item.label}
          </Radio>
        ))}
      </Stack>
    </Radio.Group>
  );
}
