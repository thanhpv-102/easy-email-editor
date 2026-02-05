import { IBlockData, RecursivePartial } from '@core/typings';
import { BlockManager } from './BlockManager';

export function createBlockDataByType<T extends IBlockData>(
  type: string,
  payload?: RecursivePartial<T>,
): IBlockData {
  const component = BlockManager.getBlockByType(type);
  if (component) {
    try {
      const blockData = component.create(payload as any);
      // Ensure block data has required structure
      if (!blockData.data) {
        blockData.data = { value: {} };
      }
      if (!blockData.data.value) {
        blockData.data.value = {};
      }
      if (!blockData.attributes) {
        blockData.attributes = {};
      }
      if (!Array.isArray(blockData.children)) {
        blockData.children = [];
      }
      return blockData;
    } catch (error) {
      console.error(`Error creating block ${type}:`, error);
      throw new Error(`Failed to create block \`${type}\`: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  throw new Error(`No match \`${type}\` block`);
}
