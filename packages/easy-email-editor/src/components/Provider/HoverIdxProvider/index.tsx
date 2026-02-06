import React, { useCallback, useState } from 'react';

export interface HoverIdxState {
  hoverIdx: string;
}

export interface DragPosition {
  left: number;
  top: number;
}
export interface DataTransfer {
  type: string;
  payload?: any;
  action: 'add' | 'move';
  positionIndex?: number;
  parentIdx?: string;
  sourceIdx?: string;
}

export const HoverIdxContext = React.createContext<{
  hoverIdx: string;
  isDragging: boolean;
  setHoverIdx: React.Dispatch<React.SetStateAction<string>>;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  direction: string;
  setDirection: React.Dispatch<React.SetStateAction<string>>;
  dataTransfer: DataTransfer | null;
  setDataTransfer: React.Dispatch<React.SetStateAction<DataTransfer | null>>;
}>({
  hoverIdx: '',
  direction: '',
  isDragging: false,
  dataTransfer: null,
  setHoverIdx: () => {},
  setIsDragging: () => {},
  setDirection: () => {},
  setDataTransfer: () => {},
});

export const HoverIdxProvider: React.FC<{ children?: React.ReactNode }> = props => {
  const [hoverIdx, setHoverIdxState] = useState('');
  const [isDragging, setIsDraggingState] = useState(false);
  const [dataTransfer, setDataTransferState] = useState<DataTransfer | null>(null);
  const [direction, setDirectionState] = useState<string>('');

  const setHoverIdx = useCallback((value: React.SetStateAction<string>) => {
    setHoverIdxState(value);
  }, []);

  const setIsDragging = useCallback((value: React.SetStateAction<boolean>) => {
    setIsDraggingState(value);
  }, []);

  const setDataTransfer = useCallback((value: React.SetStateAction<DataTransfer | null>) => {
    setDataTransferState(value);
  }, []);

  const setDirection = useCallback((value: React.SetStateAction<string>) => {
    setDirectionState(value);
  }, []);

  return (
    <HoverIdxContext.Provider
      value={{
        dataTransfer,
        setDataTransfer,
        hoverIdx,
        setHoverIdx,
        isDragging,
        setIsDragging,
        direction,
        setDirection,
      }}
    >
      {props.children}
    </HoverIdxContext.Provider>
  );
};
