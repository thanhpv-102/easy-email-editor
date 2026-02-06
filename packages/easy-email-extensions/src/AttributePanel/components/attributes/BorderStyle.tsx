import React, { useMemo } from 'react';
import { useFocusIdx } from 'easy-email-editor';
import { SelectField } from '../../../components/Form';

export const borderStyleOptions = [
  {
    value: 'dashed',
    get label() {
      return 'Dashed';
    },
  },
  {
    value: 'dotted',
    get label() {
      return 'Dotted';
    },
  },
  {
    value: 'solid',
    get label() {
      return 'Solid';
    },
  },
  {
    value: 'double',
    get label() {
      return 'double';
    },
  },
  {
    value: 'ridge',
    get label() {
      return 'ridge';
    },
  },
  {
    value: 'groove',
    get label() {
      return 'groove';
    },
  },
  {
    value: 'inset',
    get label() {
      return 'inset';
    },
  },
  {
    value: 'outset',
    get label() {
      return 'outset';
    },
  },
];

export function BorderStyle() {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      <SelectField
        label={'Style'}
        name={`${focusIdx}.attributes.border-style`}
        key={`${focusIdx}.attributes.border-style`}
        options={borderStyleOptions}
      />
    );
  }, [focusIdx]);
}
