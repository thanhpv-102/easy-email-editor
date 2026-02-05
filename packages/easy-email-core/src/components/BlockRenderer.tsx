import { IBlock } from '@core/typings';
import { BlockManager } from '@core/utils';
import { useEmailRenderContext } from '@core/utils/JsonToMjml';
import React from 'react';

type BlockDataItem = Omit<
  Parameters<IBlock['render']>[0],
  'mode' | 'context' | 'dataSource'
>;

export const BlockRenderer = (props: BlockDataItem) => {
  const { data } = props;
  const { mode, context, dataSource } = useEmailRenderContext();

  // Safe data access
  if (data?.data?.hidden) return null;

  const block = BlockManager.getBlockByType(data?.type);
  if (!block) {
    console.warn(`Block type "${data?.type}" not found in BlockManager`);
    return null;
  }

  // Ensure data has required structure
  const safeData = {
    ...data,
    data: {
      ...(data?.data || {}),
      value: data?.data?.value || {},
      hidden: data?.data?.hidden || false,
    },
    attributes: data?.attributes || {},
    children: Array.isArray(data?.children) ? data.children : [],
  };

  try {
    return <>{block.render({ ...props, data: safeData, mode, context, dataSource })}</>;
  } catch (error) {
    console.error(`Error rendering block "${data?.type}":`, error);
    // Return a fallback or empty fragment to prevent crash
    return (
      <>
        {`<!-- Error rendering block ${data?.type}: ${error instanceof Error ? error.message : String(error)} -->`}
      </>
    );
  }
};

// const BlockEditRenderer = (props: BlockDataItem) => {
//   const [refEle, setRefEle] = useState<HTMLElement | null>(null);
//   const { data, renderPortal, ...rest } = props;
//   const block = BlockManager.getBlockByType(data.type);

//   const onCallbackBlockNode = (node: HTMLElement) => {

//     if (!node) return;
//     if (node instanceof HTMLElement) {
//       if (node.classList.contains(getNodeTypeClassName(data.type))) {
//         setRefEle(node);
//       } else {
//         const ele = node.querySelector(`.${getNodeTypeClassName(data.type)}`) as HTMLElement;
//         setRefEle(ele);
//       }

//     }

//   };

//   if (!block) return null;
//   const reactBlock = block.render(props);
//   if (!reactBlock) return null;
//   return (
//     <>
//       {
//         createElement(reactBlock.type, {
//           ...reactBlock.props,
//           ref: onCallbackBlockNode,
//         })
//       }
//       {
//         refEle && renderPortal && createPortal(<>{renderPortal({ ...rest, data, refEle })}</>, refEle)
//       }
//     </>
//   );
// };
