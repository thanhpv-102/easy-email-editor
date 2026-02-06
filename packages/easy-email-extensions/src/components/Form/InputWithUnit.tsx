import React from 'react';
import { Input } from 'antd';
import type { InputProps } from 'antd';

export interface InputWithUnitProps extends Omit<InputProps, 'onChange'> {
  value: string;
  onChange: (val: string) => void;
  unitOptions?: Array<{ value: string; label: string; }> | 'default' | 'percent';
  quickchange?: boolean;
}

export function InputWithUnit(props: InputWithUnitProps) {
  const {
    value = '',
    onKeyDown,
    onChange,
    unitOptions: _unitOptions,
    quickchange: _quickchange,
    ...restProps
  } = props;

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      {...restProps}
    />
  );
}
