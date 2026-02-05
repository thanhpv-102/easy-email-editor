import { BasicType, AdvancedType } from '@thanhpv102/easy-email-core';

export function isTextBlock(blockType: any) {
  return blockType === BasicType.TEXT || blockType === AdvancedType.TEXT;
}