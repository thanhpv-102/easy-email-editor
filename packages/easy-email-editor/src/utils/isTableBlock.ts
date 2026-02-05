import { BasicType, AdvancedType } from '@thanhpv102/easy-email-core';

export function isTableBlock(blockType: any) {
  return blockType === AdvancedType.TABLE;
}
