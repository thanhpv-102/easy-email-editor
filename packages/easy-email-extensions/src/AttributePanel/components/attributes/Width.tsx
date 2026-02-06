import React, { useCallback } from 'react';
import { InputWithUnitField } from '../../../components/Form';
import { useFocusIdx, useBlock } from 'easy-email-editor';
import { BasicType, getParentByIdx } from 'easy-email-core';
import { InputWithUnitProps } from '@extensions/components/Form/InputWithUnit';
import { UseFieldConfig } from 'easy-email-editor';

export function Width({
  inline = false,
  unitOptions,
  config,
}: {
  inline?: boolean;
  unitOptions?: InputWithUnitProps['unitOptions'];
  config?: UseFieldConfig;
}) {
  const { focusIdx } = useFocusIdx();
  const { focusBlock, values } = useBlock();
  const parentType = values && getParentByIdx(values, focusIdx)?.type;

  const validate = useCallback(
    (val: string): string | undefined => {
      if (focusBlock?.type === BasicType.COLUMN.toString() && parentType === BasicType.GROUP.toString()) {
          return /(\d)*%/.test(val)
            ? undefined
            : 'Column inside a group must have a width in percentage, not in pixel';
      }
      return undefined;
    },
    [focusBlock?.type, parentType],
  );

  return (
    <InputWithUnitField
      validate={validate}
      label={'Width'}
      inline={inline}
      name={`${focusIdx}.attributes.width`}
      unitOptions={unitOptions}
      config={config}
    />
  );
}
