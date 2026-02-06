import React, { useCallback } from 'react';

import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { ToolItem } from '../ToolItem';
import { IconFont } from 'easy-email-editor';

const list = [
  {
    value: '1',
    label: '12px',
  },
  {
    value: '2',
    label: '13px',
  },
  {
    value: '3',
    label: '16px',
  },
  {
    value: '4',
    label: '18px',
  },
  {
    value: '5',
    label: '24px',
  },
  {
    value: '6',
    label: '32px',
  },
  {
    value: '7',
    label: '48px',
  },
];

export interface FontSizeProps {
  execCommand: (cmd: string, value: string) => void;
  getPopupContainer: () => HTMLElement;
}

export function FontSize(props: FontSizeProps) {
  const { execCommand } = props;
  const [visible, setVisible] = React.useState(false);

  const onChange = useCallback(
    (val: string) => {
      execCommand('fontSize', val);
      setVisible(false);
    },
    [execCommand],
  );

  const onVisibleChange = useCallback((v: boolean) => {
    setVisible(v);
  }, []);

  const menuItems: MenuProps['items'] = list.map(item => ({
    key: item.value,
    label: (
      <div style={{ lineHeight: '30px', height: 30 }}>
        {item.label}
      </div>
    ),
  }));

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    onChange(key);
  };

  return (
    <Dropdown
      trigger={['click']}
      placement="bottomLeft"
      open={visible}
      onOpenChange={onVisibleChange}
      getPopupContainer={props.getPopupContainer}
      menu={{
        items: menuItems,
        onClick: handleMenuClick,
        style: {
          maxWidth: 150,
          maxHeight: 350,
          overflowY: 'auto',
          overflowX: 'hidden',
        }
      }}
    >
      <ToolItem
        title={t('Font size')}
        icon={<IconFont iconName="icon-font-color" />}
      />
    </Dropdown>
  );
}
