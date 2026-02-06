import { Card, Space, TabsProps, Typography } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';
import React from 'react';


export interface EditGridTabProps<T = unknown>
  extends Omit<TabsProps, 'onChange'> {
  value: Array<T>;
  renderItem: (item: T, index: number) => React.ReactNode;
  onChange: (vals: Array<T>) => unknown;
  additionItem?: T;
  label: string;
}
export function EditGridTab<T = unknown>(props: EditGridTabProps<T>) {
  const { value, additionItem } = props;

  const onAdd = (index: number) => {
    let newItem = additionItem || cloneDeep(value[index]);
    value.splice(index + 1, 0, newItem);
    props.onChange([...value]);
  };

  const onDelete = (index: number) => {
    props.onChange(value.filter((_, vIndex) => Number(index) !== vIndex));
  };
  return (
    <Card
      variant="borderless"
    >
      {(Array.isArray(value) ? value : []).map((item, index) => (
        <Card.Grid style={{ width: '100%' }} key={index}>
          <Card title={(
            <Space>
              <Typography.Text>
                {'Item'} {index + 1}
              </Typography.Text>

            </Space>
          )} extra={(
            <Space size="large">
              <PlusOutlined style={{ color: '#000', cursor: 'pointer' }} onClick={() => onAdd(index)} />
              <CloseOutlined style={{ color: '#000', cursor: 'pointer' }} onClick={() => onDelete(index)} />
            </Space>
          )}
          >
            {props.renderItem(item, index)}
          </Card>
        </Card.Grid>
      ))}
    </Card>
  );

}
