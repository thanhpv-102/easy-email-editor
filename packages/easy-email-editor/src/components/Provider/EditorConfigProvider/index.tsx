import React, { useCallback, useContext, useMemo, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MergeTagsType = Record<string, any>;

export interface EditorRuntimeConfig {
  dashed?: boolean;
  compact?: boolean;
  mergeTags?: MergeTagsType;
  socialIcons?: Array<{ content: string; image: string }>;
}

export interface EditorConfigContextValue {
  runtimeConfig: EditorRuntimeConfig;
  setRuntimeConfig: (config: Partial<EditorRuntimeConfig>) => void;
  isConfigOpen: boolean;
  openConfig: () => void;
  closeConfig: () => void;
}

export const EditorConfigContext = React.createContext<EditorConfigContextValue>({
  runtimeConfig: {},
  setRuntimeConfig: () => {},
  isConfigOpen: false,
  openConfig: () => {},
  closeConfig: () => {},
});

export const EditorConfigProvider: React.FC<{
  children: React.ReactNode;
  initialConfig?: EditorRuntimeConfig;
}> = ({ children, initialConfig = {} }) => {
  const [runtimeConfig, setRuntimeConfigState] = useState<EditorRuntimeConfig>(initialConfig);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const setRuntimeConfig = useCallback((config: Partial<EditorRuntimeConfig>) => {
    setRuntimeConfigState(prev => ({ ...prev, ...config }));
  }, []);

  const openConfig = useCallback(() => setIsConfigOpen(true), []);
  const closeConfig = useCallback(() => setIsConfigOpen(false), []);

  const value = useMemo(
    () => ({ runtimeConfig, setRuntimeConfig, isConfigOpen, openConfig, closeConfig }),
    [runtimeConfig, setRuntimeConfig, isConfigOpen, openConfig, closeConfig],
  );

  return (
    <EditorConfigContext.Provider value={value}>
      {children}
    </EditorConfigContext.Provider>
  );
};

export function useEditorConfig() {
  return useContext(EditorConfigContext);
}
