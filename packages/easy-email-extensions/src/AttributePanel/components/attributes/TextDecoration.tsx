
import React, { useMemo } from 'react';
import { useFocusIdx } from 'easy-email-editor';
import { SelectField } from '../../../components/Form';

const options = [
  {
    value: '',
    get label() {
      return 'None';
    },
  },
  {
    value: 'underline',
    get label() {
      return 'Underline';
    },
  },
  {
    value: 'overline',
    get label() {
      return 'Overline';
    },
  },
  {
    value: 'line-through',
    get label() {
      return 'Line through';
    },
  },
  {
    value: 'blink',
    get label() {
      return 'Blink';
    },
  },
  {
    value: 'inherit',
    get label() {
      return 'Inherit';
    },
  },
];

export function TextDecoration({ name }: { name?: string }) {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      <SelectField
        label={'Text decoration'}
        name={name || `${focusIdx}.attributes.text-decoration`}
        options={options}
      />
    );
  }, [focusIdx, name]);
}
