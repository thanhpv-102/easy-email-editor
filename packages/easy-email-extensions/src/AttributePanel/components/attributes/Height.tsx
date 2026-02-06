import React, { useMemo } from 'react';
import { TextField } from '../../../components/Form';
import { Stack, UseFieldConfig, useFocusIdx } from 'easy-email-editor';

export function Height({
                         inline,
                         config,
                       }: {
  inline?: boolean;
  config?: UseFieldConfig;
}) {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      <Stack wrap={false}>
        <Stack.Item fill>
          <TextField
            label={'Height'}
            name={`${focusIdx}.attributes.height`}
            quickchange
            inline={inline}
            config={config}
          />
        </Stack.Item>
      </Stack>
    );
  }, [focusIdx, inline]);
}
