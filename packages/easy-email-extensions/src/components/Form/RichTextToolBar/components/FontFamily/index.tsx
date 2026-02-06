import React, { useCallback } from 'react';

import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { ToolItem } from '../ToolItem';
import { IconFont } from 'easy-email-editor';
import { useFontFamily } from '@extensions/hooks/useFontFamily';

export interface FontFamilyProps {
  execCommand: (cmd: string, value: string) => void;
  getPopupContainer: () => HTMLElement;
}

export function FontFamily(props: FontFamilyProps) {
  const { fontList } = useFontFamily();
  const { execCommand } = props;
  const [visible, setVisible] = React.useState(false);

  const onChange = useCallback(
    (val: string) => {
      execCommand('fontName', val);
      setVisible(false);
    },
    [execCommand],
  );

  const onVisibleChange = useCallback((v: boolean) => {
    setVisible(v);
  }, []);

  const menuItems: MenuProps['items'] = fontList.map(item => ({
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
        title={t('Font family')}
        icon={<IconFont iconName="icon-font-family" />}
      />
    </Dropdown>
  );
}
