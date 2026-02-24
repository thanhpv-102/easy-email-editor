import { useEditorContext, useEditorProps } from 'easy-email-editor';
import React, { useMemo } from 'react';

const DEFAULT_FONT_LIST: Array<{ value: string; label: string }> = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Tahoma', label: 'Tahoma' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
  { value: 'Impact', label: 'Impact' },
];

export function useFontFamily() {
  const { fontList: defaultFontList } = useEditorProps();
  const { pageData } = useEditorContext();

  const addFonts = pageData?.data.value.fonts;

  const fontList = useMemo(() => {
    const fonts: Array<{
      value: string;
      label: React.ReactNode;
    }> = [];
    // Use provided fontList if non-empty, otherwise fall back to built-in defaults
    const baseList = defaultFontList && defaultFontList.length > 0 ? defaultFontList : DEFAULT_FONT_LIST;
    fonts.push(...baseList);
    if (addFonts) {
      const options = addFonts.map(item => ({ value: item.name, label: item.name }));
      fonts.unshift(...options);
    }

    return fonts.map(item => ({ value: item.value, label: <span style={{ fontFamily: item.value }}>{item.label}</span> }));
  }, [addFonts, defaultFontList]);

  return {
    fontList
  };
}