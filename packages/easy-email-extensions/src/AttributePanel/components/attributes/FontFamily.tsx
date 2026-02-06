import React, { useMemo } from 'react';
import { useFocusIdx } from 'easy-email-editor';
import { AutoCompleteField } from '../../../components/Form';
import { useFontFamily } from '@extensions/hooks/useFontFamily';

export function FontFamily({ name }: { name?: string }) {
  const { focusIdx } = useFocusIdx();
  const { fontList } = useFontFamily();

  const transformedFontList = useMemo(() => {
    return fontList.map(font => ({
      value: font.value,
      label: font.value, // Use the font value as the label since AutoCompleteField expects string labels
    }));
  }, [fontList]);

  return useMemo(() => {
    return (
      <AutoCompleteField
        style={{ minWidth: 60, flex: 1 }}
        showSearch
        label={'Font family'}
        name={name || `${focusIdx}.attributes.font-family`}
        options={transformedFontList}
      />
    );
  }, [focusIdx, transformedFontList, name]);
}
