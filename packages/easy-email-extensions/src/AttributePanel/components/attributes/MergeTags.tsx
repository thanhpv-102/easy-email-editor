import React, { useCallback, useMemo, useState } from 'react';
import { Tree, TreeSelect } from 'antd';
import { get, isObject } from 'lodash';
import { useBlock, useEditorProps, useFocusIdx } from 'easy-email-editor';
import { getContextMergeTags } from '@extensions/utils/getContextMergeTags';

interface TreeNodeData {
  key: string;
  value: string;
  title: string;
  children: TreeNodeData[];
}

interface MergeTagObject {
  [key: string]: string | number | boolean | MergeTagObject | MergeTagObject[] | undefined;
}

export const MergeTags: React.FC<{
  onChange: (v: string) => void;
  value: string;
  isSelect?: boolean;
}> = React.memo((props) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const { focusIdx } = useFocusIdx();
  const {
    mergeTags = {},
    mergeTagGenerate,
    renderMergeTagContent,
  } = useEditorProps();
  const { values } = useBlock();

  const contextMergeTags = useMemo(
    () => values && getContextMergeTags(mergeTags, values, focusIdx),
    [mergeTags, values, focusIdx]
  );

  const treeOptions = useMemo(() => {
    const treeData: TreeNodeData[] = [];
    const deep = (
      key: string,
      title: string,
      parent: MergeTagObject,
      mapData: TreeNodeData[] = []
    ) => {
      const currentMapData: TreeNodeData = {
        key: key,
        value: key,
        title: title,
        children: [],
      };

      mapData.push(currentMapData);
      const current = parent[title];
      if (current && typeof current === 'object' && !Array.isArray(current)) {
        Object.keys(current as Record<string, unknown>).forEach((childKey) =>
          deep(key + '.' + childKey, childKey, current, currentMapData.children)
        );
      }
    };

    if (!contextMergeTags) return treeData;

    Object.keys(contextMergeTags).forEach((key) =>
      deep(key, key, contextMergeTags, treeData)
    );
    return treeData;
  }, [contextMergeTags]);

  const onSelect = useCallback(
    (key: string) => {
      const value = get(contextMergeTags, key);
      if (isObject(value)) {
        setExpandedKeys((keys) => {
          if (keys.includes(key)) {
            return keys.filter((k) => k !== key);
          } else {
            return [...keys, key];
          }
        });
        return;
      }
      return props.onChange(mergeTagGenerate(key));
    },
    [contextMergeTags, props, mergeTagGenerate]
  );

  const mergeTagContent = useMemo(
    () =>
      renderMergeTagContent ? (
        renderMergeTagContent({
          onChange: props.onChange,
          isSelect: Boolean(props.isSelect),
          value: props.value,
        })
      ) : (
        <></>
      ),
    [renderMergeTagContent, props.onChange, props.isSelect, props.value]
  );

  if (renderMergeTagContent) {
    return <>{mergeTagContent}</>;
  }

  return (
    <div style={{ color: '#333' }}>
      {props.isSelect ? (
        <TreeSelect
          value={props.value}
          size='small'
          popupMatchSelectWidth
          placeholder={'Please select'}
          treeData={treeOptions}
          onChange={(val) => onSelect(val)}
          style={{ maxHeight: 400, overflow: 'auto' }}
        />
      ) : (
        <Tree
          expandedKeys={expandedKeys}
          onExpand={(keys) => setExpandedKeys(keys.map(k => String(k)))}
          selectedKeys={[]}
          treeData={treeOptions}
          onSelect={(selectedKeys) => onSelect(String(selectedKeys[0]))}
          style={{
            maxHeight: 400,
            overflow: 'auto',
          }}
        />
      )}
    </div>
  );
});
