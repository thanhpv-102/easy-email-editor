import { BasicType, AdvancedType } from '@thanhpv102/easy-email-core';

export function isButtonBlock(blockType: any) {
  return blockType === BasicType.BUTTON || blockType === AdvancedType.BUTTON;
}