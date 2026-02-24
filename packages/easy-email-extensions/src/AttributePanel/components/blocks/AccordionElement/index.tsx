import React from 'react';
import { Border } from '../../attributes/Border';
import { BackgroundColor } from '../../attributes/BackgroundColor';
import { FontFamily } from '../../attributes/FontFamily';
import { AttributesPanelWrapper } from '../../attributes/AttributesPanelWrapper';
import { Collapse, Space } from 'antd';

export function AccordionElement() {
  // const { focusIdx } = useFocusIdx();
  return (
    <AttributesPanelWrapper>
      <Collapse defaultActiveKey={['0', '1', '2']} items={[
        {
          key: '0',
          label: t('Setting'),
          children: (
            <Space orientation="vertical" size="small">
              <Border />
              <BackgroundColor />
              <FontFamily />
            </Space>
          ),
        },
      ]}
      />
    </AttributesPanelWrapper>
  );
}
