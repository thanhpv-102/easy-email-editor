import { useContext } from 'react';
import { HoverIdxContext } from '@/components/Provider/HoverIdxProvider';

export function useHoverIdx() {
  const {
    hoverIdx,
    setHoverIdx,
    setIsDragging,
    isDragging,
    setDirection,
    direction,
  } = useContext(HoverIdxContext);

  return {
    hoverIdx,
    setHoverIdx,
    isDragging,
    setIsDragging,
    direction,
    setDirection,
  };
}
