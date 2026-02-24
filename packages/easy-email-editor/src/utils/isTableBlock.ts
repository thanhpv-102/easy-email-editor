import { BasicType, AdvancedType } from 'easy-email-core';

export function isTableBlock(blockType: string) {
  return blockType === AdvancedType.TABLE.toString();
}
