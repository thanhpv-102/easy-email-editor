import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import React from 'react';

export function Heading(props: { onChange: (val: string) => void }) {
  const list = [
    {
      value: 'H1',
      label: 'H1',
    },
    {
      value: 'H2',
      label: 'H2',
    },
    {
      value: 'H3',
      label: 'H3',
    },
    {
      value: 'H4',
      label: 'H4',
    },
    {
      value: 'H5',
      label: 'H5',
    },
    {
      value: 'H6',
      label: 'H6',
    },
    {
      value: 'P',
      label: t('Paragraph'),
    },
  ];

  const menuItems: MenuProps['items'] = list.map(item => ({
    key: item.value,
    label: (
      <div style={{ lineHeight: '30px', height: 30 }}>
        {item.label}
      </div>
    ),
  }));

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    props.onChange(key);
  };

  return (
    <Menu
      items={menuItems}
      onClick={handleMenuClick}
      selectedKeys={[]}
      style={{ width: 100, border: 'none' }}
    />
  );
}
