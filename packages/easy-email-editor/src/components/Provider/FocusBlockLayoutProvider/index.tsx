import { useFocusIdx } from '@/hooks/useFocusIdx';
import React, { useEffect, useMemo, useState } from 'react';
import { getBlockNodeByIdx, getShadowRoot, getValidPortalNode } from '@/utils';
import { DATA_RENDER_COUNT } from '@/constants';
import { useEditorContext } from '@/hooks/useEditorContext';
import { useRefState } from '@/hooks/useRefState';

export const FocusBlockLayoutContext = React.createContext<{
  focusBlockNode: HTMLElement | null;
  focusBlockPortalNode: HTMLElement | null;
}>({
  focusBlockNode: null,
  focusBlockPortalNode: null,
});

export const FocusBlockLayoutProvider: React.FC<{
  children?: React.ReactNode;
}> = props => {
  const [focusBlockNode, setFocusBlockNode] = useState<HTMLElement | null>(null);
  const [focusBlockPortalNode, setFocusBlockPortalNode] = useState<HTMLElement | null>(null);
  const { initialized } = useEditorContext();
  const { focusIdx } = useFocusIdx();
  const focusIdxRef = useRefState(focusIdx);

  const root = useMemo(() => {
    return initialized ? getShadowRoot()?.querySelector(`[${DATA_RENDER_COUNT}]`) : null;
  }, [initialized]);

  useEffect(() => {
    if (!root) return;
    let lastCount: any = '0';
    const ms = new MutationObserver(() => {
      const currentCount = root.getAttribute(DATA_RENDER_COUNT);
      if (lastCount !== currentCount) {
        lastCount = currentCount;

        const ele = getBlockNodeByIdx(focusIdxRef.current);
        if (ele) {
          setFocusBlockNode(ele);
          setFocusBlockPortalNode(getValidPortalNode(ele) as HTMLElement);
        }
      }
    });
    ms.observe(root, {
      attributeFilter: [DATA_RENDER_COUNT],
    });

    return () => {
      ms.disconnect();
    };
  }, [focusIdxRef, root]);

  useEffect(() => {
    if (!root) return;
    if (focusIdx) {
      root.setAttribute(DATA_RENDER_COUNT, (+new Date()).toString());
    }
  }, [focusIdx, root]);

  const value = useMemo(() => {
    return {
      focusBlockNode,
      focusBlockPortalNode,
    };
  }, [focusBlockNode, focusBlockPortalNode]);

  return (
    <FocusBlockLayoutContext.Provider value={value}>
      {props.children}
    </FocusBlockLayoutContext.Provider>
  );
};
