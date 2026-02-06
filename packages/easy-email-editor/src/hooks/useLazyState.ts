import { debounce } from 'lodash';
import { useRef, useState, useEffect } from 'react';

export function useLazyState<T>(state: T, debounceTime: number) {
  const [lazyState, setLazyState] = useState<T>(state);

  const debouncedSetRef = useRef(
    debounce((s: T) => {
      setLazyState(s);
    }, debounceTime)
  );

  useEffect(() => {
    debouncedSetRef.current(state);
  }, [state]);

  return lazyState;
}
