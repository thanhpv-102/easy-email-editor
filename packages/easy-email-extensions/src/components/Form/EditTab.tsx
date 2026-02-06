import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { classnames } from '@extensions/utils/classnames';
import React, { useState } from 'react';
import styles from './index.module.scss';

export interface EditTabProps<T = unknown>
  extends Omit<TabsProps, 'onChange' | 'items' | 'type' | 'activeKey' | 'onEdit'> {
  value: Array<T>;
  renderItem: (item: T, index: number) => React.ReactNode;
  onChange: (vals: Array<T>) => void;
  additionItem: T;
  label: string;
}

export function EditTab<T = unknown>(props: EditTabProps<T>) {
  const { value, additionItem, label, renderItem, onChange, tabPlacement, ...restProps } = props;
  const [activeKey, setActiveKey] = useState('0');

  const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'add') {
      const newKey = value.length.toString();
      setActiveKey(newKey);
      onChange([...value, additionItem]);
    } else if (action === 'remove' && typeof targetKey === 'string') {
      const removeIndex = parseInt(targetKey, 10);
      if (removeIndex < parseInt(activeKey, 10)) {
        setActiveKey((parseInt(activeKey, 10) - 1).toString());
      }
      if (removeIndex === parseInt(activeKey, 10)) {
        setActiveKey(removeIndex > 0 ? (removeIndex - 1).toString() : '0');
      }
      onChange(value.filter((_, index) => index !== removeIndex));
    }
  };

  const items = (Array.isArray(value) ? value : []).map((item, index) => ({
    key: index.toString(),
    label: `${label || 'Tab'} ${index + 1}`,
    children: (
      <div style={{ paddingLeft: 12 }}>
        {renderItem(item, index)}
      </div>
    ),
  }));

  return (
    <Tabs
      {...restProps}
      className={classnames(styles.editTab)}
      style={{ border: 'none' }}
      type="editable-card"
      activeKey={activeKey}
      tabPlacement={tabPlacement}
      items={items}
      onEdit={onEdit}
      onChange={setActiveKey}
    />
  );
}
