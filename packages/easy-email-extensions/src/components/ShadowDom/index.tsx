import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export const ShadowDom: React.FC<React.HTMLProps<HTMLElement>> = (props) => {
  const [root, setRoot] = useState<null | ShadowRoot>(null);
  const [ref, setRef] = useState<null | HTMLDivElement>(null);

  useEffect(() => {
    if (ref) {
      const root = ref.attachShadow({ mode: 'open' });
      setRoot(root);
    }
  }, [ref]);

  // Extract key and children to avoid React 19 spreading issues
  const { key, children, ...divProps } = props;

  return (
    <>
      <div key={key} {...divProps} ref={setRef}>
        {root && ReactDOM.createPortal(children, root as any)}
      </div>
    </>
  );
};
