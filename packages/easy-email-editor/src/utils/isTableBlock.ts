import { BasicType, AdvancedType } from '@thanhpv102/easy-email-core';

export function isTableBlock(blockType: string) {
  return blockType === AdvancedType.TABLE.toString();
}
