import React from 'react';
import { FocusTooltip } from './components/FocusTooltip';
import { HoverTooltip } from './components/HoverTooltip';

export function InteractivePrompt() {
  return (
    <>
      <HoverTooltip />
      <FocusTooltip />

    </>
  );
}
