import { Input } from 'antd';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useState } from 'react';

interface CellBackgroundSelectorProps {
  bgColorHandler: (color: string) => void;
  rootDom: Element;
}

const CellBackgroundSelector: React.FC<CellBackgroundSelectorProps> = ({
  bgColorHandler,
  rootDom,
}) => {
  const [color, setColor] = useState('#ffffff');

  useEffect(() => {
    if (!rootDom) {
      return;
    }
    const observer = new ResizeObserver(() => {
      setColor('#ffffff');
    });
    observer.observe(rootDom);
    return () => {
      observer.disconnect();
    };
  }, [rootDom]);

  return (
    <div
      onClick={e => e.stopPropagation()}
      className='easy-email-table-operation-menu-bg-item'
    >
      <div>{t('Set Background Color')}</div>
      <div>
        <div className='easy-email-table-operation-menu-bg-item-color'>
          <div style={{ backgroundColor: color }} />
          <input
            type='color'
            value={color}
            onChange={e => setColor(e.target.value)}
          />
        </div>
        <Input.Search
          enterButton={t('Set')}
          onSearch={() => bgColorHandler(color)}
          value={color}
          onKeyDown={e => e.stopPropagation()}
          onChange={e => setColor(e.target.value)}
        />
      </div>
    </div>
  );
};

const getCellBackgroundSelectorRoot = (
  bgColorHandler: CellBackgroundSelectorProps['bgColorHandler'],
  rootDom: Element,
) => {
  const node = document.createElement('div');

  const root = createRoot(node);
  root.render(
    <CellBackgroundSelector
      bgColorHandler={bgColorHandler}
      rootDom={rootDom}
    />,
  );
  return node;
};

export default getCellBackgroundSelectorRoot;
