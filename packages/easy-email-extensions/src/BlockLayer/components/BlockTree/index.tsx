import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Tree } from 'antd';
import type { DataNode, TreeProps, EventDataNode } from 'antd/es/tree';
import { debounce } from 'lodash';
import { transparentImage } from './transparentImage';

interface TreeNode<T> {
  id: string;
  children?: T[];
}

// Extended data node interface to include our custom properties
interface ExtendedDataNode extends DataNode {
  dataRef?: unknown;
  parent?: unknown;
  parentKey?: string;
}

export interface BlockTreeProps<T extends TreeNode<T>> {
  treeData: T[];
  selectedKeys?: string[];
  expandedKeys?: string[];
  onSelect: (selectedId: string) => void;
  onContextMenu?: (nodeData: T, ev: React.MouseEvent) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onMouseLeave?: () => void;
  onMouseEnter?: (id: string) => void;
  renderTitle: (data: T) => React.ReactNode;
  defaultExpandAll?: boolean;
  allowDrop: (o: {
    dragNode: { type: string } | { key: string };
    dropNode: { dataRef: T; parent: T; key: string };
    dropPosition: number;
  }) =>
    | false
    | {
        key: string;
        position: number;
      };

  onDrop: (o: {
    dragNode: { dataRef: T; parent: T; key: string; parentKey: string };
    dropNode: { dataRef: T; parent: T; key: string; parentKey: string };
    dropPosition: number;
  }) => void;
}

const img = new Image();
img.width = 0;
img.height = 0;
img.src = transparentImage;

// Transform TreeNode data to DataNode format for antd Tree
const transformTreeData = <T extends TreeNode<T> & { parent?: unknown }>(data: T[] | undefined, parentKey?: string): DataNode[] => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  return data
    .filter((item): item is T => {
      const isValid = Boolean(item && item.id);
      if (!isValid) {
        console.error('[BlockTree] Filtering out item without id:', item);
      }
      return isValid;
    })
    .map((item) => {
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;

      const node: ExtendedDataNode = {
        key: item.id,
        title: item.id, // This will be overridden by titleRender
        children: hasChildren ? transformTreeData(item.children as T[], item.id) : undefined,
        dataRef: item as unknown, // Store original data for callbacks
        parentKey: parentKey, // Store parent key for proper tree navigation
        parent: item.parent, // Extract parent from the original data item
      };
      return node;
    });
};

export function BlockTree<T extends TreeNode<T>>(props: BlockTreeProps<T>) {
  const [blockTreeRef, setBlockTreeRef] = useState<HTMLElement | null>(null);
  const dragNode = useRef<{
    dataRef: T;
    parent: T;
    key: string;
    parentKey: string;
  } | null>(null);

  const { treeData, allowDrop, onContextMenu, selectedKeys } = props;
  const treeDataRef = useRef(treeData);
  const {
    onDragStart: propsDragStart,
    onDrop: propsDrop,
    renderTitle: propsRenderTitle,
    onDragEnd: propsDragEnd,
    onSelect: propsSelect,
  } = props;

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const onExpand = useCallback(
    (keys: React.Key[]) => {
      setExpandedKeys(keys.map(key => String(key)));
    },
    [setExpandedKeys]
  );

  useEffect(() => {
    if (props.defaultExpandAll) {
      const keys: string[] = [];
      const loop = (data: T) => {
        keys.push(data.id);
        data.children?.forEach(loop);
      };
      treeDataRef.current.forEach(loop);
      setExpandedKeys(keys);
    }
  }, [props.defaultExpandAll]);

  useEffect(() => {
    setExpandedKeys((keys) =>
      props.expandedKeys ? [...keys, ...props.expandedKeys] : keys
    );
  }, [props.expandedKeys]);

  const onDragStart = useCallback(
    (info: { event: React.DragEvent; node: EventDataNode<DataNode> }) => {
      const { event: e, node } = info;
      e.dataTransfer.dropEffect = 'none';
      // e.dataTransfer.setDragImage(img, 0, 0);
      const extendedNode = node as unknown as ExtendedDataNode;
      const dragNodeData = extendedNode.dataRef as T;
      dragNode.current = {
        dataRef: dragNodeData,
        parent: extendedNode.parent as T,
        key: node.key as string,
        parentKey: extendedNode.parentKey as string,
      };
      propsDragStart?.();
    },
    [propsDragStart]
  );

  const onDragMove = useCallback(
    (option: { dragNode: EventDataNode<DataNode>; dropNode: EventDataNode<DataNode>; dropPosition: number }) => {
      if (!dragNode.current) return false;
      const extendedDropNode = option.dropNode as unknown as ExtendedDataNode;
      const dropData = extendedDropNode.dataRef as T;
      const dropId = option.dropNode.key;
      const currentDropData: Parameters<BlockTreeProps<T>['allowDrop']>[0] = {
        dragNode: { key: dragNode.current.key },
        dropNode: {
          dataRef: dropData,
          parent: extendedDropNode.parent as T,
          key: dropId as string,
        },
        dropPosition: option.dropPosition,
      };
      const isAllowDrop = allowDrop(currentDropData);

      return Boolean(isAllowDrop);
    },
    [allowDrop]
  );

  // Wrapper to match antd Tree's allowDrop signature
  const allowDropWrapper = useCallback(
    (options: unknown) => {
      const typedOptions = options as { dragNode: DataNode; dropNode: DataNode; dropPosition: number };
      // Convert to our expected format
      const convertedOptions = {
        dragNode: typedOptions.dragNode as unknown as EventDataNode<DataNode>,
        dropNode: typedOptions.dropNode as unknown as EventDataNode<DataNode>,
        dropPosition: typedOptions.dropPosition,
      };
      return onDragMove(convertedOptions);
    },
    [onDragMove]
  );

  const onDrop = useCallback(
    (info: {
      event: React.DragEvent;
      node: EventDataNode<DataNode>;
      dragNode: EventDataNode<DataNode>;
      dragNodesKeys: React.Key[];
      dropPosition: number;
      dropToGap: boolean;
    }) => {
      const { node: dropNode, dropPosition, event: e } = info;
      e.dataTransfer.dropEffect = 'move';
      if (!dragNode.current || !dropNode) return;

      const extendedDropNode = dropNode as unknown as ExtendedDataNode;
      const dropData = extendedDropNode.dataRef as T;
      const currentDropData: Parameters<BlockTreeProps<T>['onDrop']>[0] = {
        dragNode: dragNode.current,
        dropNode: {
          dataRef: dropData,
          parent: extendedDropNode.parent as T,
          key: dropNode.key as string,
          parentKey: extendedDropNode.parentKey as string,
        },
        dropPosition,
      };
      propsDrop(currentDropData);
    },
    [propsDrop]
  );

  const titleRender = useCallback(
    (nodeData: DataNode & { dataRef?: T }) => {
      return (
        <div
          style={{ display: 'inline-flex', width: '100%' }}
          onContextMenu={(ev) => onContextMenu && onContextMenu(nodeData.dataRef as T, ev)}
        >
          {propsRenderTitle(nodeData.dataRef as T)}
        </div>
      );
    },
    [onContextMenu, propsRenderTitle]
  );

  const onDragEnd = useCallback(() => {
    dragNode.current = null;
    propsDragEnd?.();
  }, [propsDragEnd]);

  const onSelect = useCallback(
    (selectedKeys: React.Key[]) => {
      propsSelect(selectedKeys[0] as string);
    },
    [propsSelect]
  );

  useEffect(() => {
    if (blockTreeRef) {
      blockTreeRef.addEventListener('dragover', (e) => {
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'move';
        }
      });
    }
  }, [blockTreeRef]);

  const transformedTreeData = useMemo(() => transformTreeData(treeData), [treeData]);

  return useMemo(
    () => (
      <div ref={setBlockTreeRef} onMouseLeave={props.onMouseLeave}>
        <CacheTree
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          onExpand={onExpand}
          draggable
          treeData={transformedTreeData}
          blockNode
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          onDrop={onDrop}
          allowDrop={allowDropWrapper}
          onSelect={onSelect}
          titleRender={titleRender}
        />
      </div>
    ),
    [
      transformedTreeData,
      props.onMouseLeave,
      expandedKeys,
      selectedKeys,
      onExpand,
      onDragEnd,
      onDragStart,
      onDrop,
      allowDropWrapper,
      onSelect,
      titleRender,
    ]
  );
}

const cacheTreeDebounceCallback = debounce(
  (data: TreeProps, setCacheProps: (s: TreeProps) => void) => {
    setCacheProps(data);
  },
  300
);

function CacheTree(props: TreeProps) {
  const [cacheProps, setCacheProps] = useState(props);
  const lastProps = useRef(props);

  useEffect(() => {
    if (lastProps.current.treeData !== props.treeData) {
      lastProps.current = props;
      cacheTreeDebounceCallback(props, setCacheProps);
    } else {
      lastProps.current = props;
      setCacheProps(props);
    }
  }, [props]);

  useEffect(() => {
    return () => {
      cacheTreeDebounceCallback.cancel();
    };
  }, []);

  return useMemo(() => <Tree {...cacheProps} />, [cacheProps]);
}
