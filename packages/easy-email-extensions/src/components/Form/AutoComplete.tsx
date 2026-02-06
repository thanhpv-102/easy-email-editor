import React, { useMemo } from 'react';
import { AutoComplete as AntdAutoComplete } from 'antd';
import type { AutoCompleteProps as AntdAutoCompleteProps } from 'antd';
import { isString } from 'lodash';

export interface AutoCompleteProps
  extends Omit<AntdAutoCompleteProps, 'onChange' | 'options'> {
  quickchange?: boolean;
  value: string;
  options: Array<{ value: string | number; label: string | number }>;
  onChange: (val: string) => void;
  showSearch?: boolean;
}

export function AutoComplete(props: AutoCompleteProps) {
  const options = useMemo(() => {
    const selectedValue = (props.value || '').toLowerCase();
    return props.options
      .filter(item => {
        return (
          (isString(item.value) && item.value.toLowerCase().startsWith(selectedValue)) ||
          (isString(item.label) && item.label.toLowerCase().startsWith(selectedValue))
        );
      })
      .map(item => ({
        value: String(item.value),
        label: String(item.label)
      }));
  }, [props.options, props.value]);

  return (
    <AntdAutoComplete
      {...props}
      options={options}
      onChange={props.onChange}
    />
  );
}
