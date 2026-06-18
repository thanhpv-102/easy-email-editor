import React, { useMemo } from 'react';
import { ColorPickerField } from '../../../components/Form';
import { useFocusIdx } from '@thanhpv102/easy-email-editor';

export function BorderColor() {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      <ColorPickerField
        label={t('Color')}
        name={`${focusIdx}.attributes.border-color`}
        key={`${focusIdx}.attributes.border-color`}
      />
    );
  }, [focusIdx]);
}
