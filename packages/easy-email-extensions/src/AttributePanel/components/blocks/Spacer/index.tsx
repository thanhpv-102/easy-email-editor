
import React from 'react';
import { Height } from '@extensions/AttributePanel/components/attributes/Height';
import { ContainerBackgroundColor } from '@extensions/AttributePanel/components/attributes/ContainerBackgroundColor';
import { Padding } from '@extensions/AttributePanel/components/attributes/Padding';
import { AttributesPanelWrapper } from '@extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Collapse, Row, Col, Space } from 'antd';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';

export function Spacer() {
  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['-1', '0', '1', '2', '3']}>
        <Collapse.Panel key='1' header={t('Dimension')}>
          <Space orientation='vertical' size='small'>
            <Height />
            <Padding />
          </Space>
        </Collapse.Panel>

        <Collapse.Panel key='2' header={t('Background')}>
          <ContainerBackgroundColor title={t('Background color')} />
        </Collapse.Panel>

        <Collapse.Panel key='4' header={t('Extra')}>
          <Col span={24}>
            <ClassName />
          </Col>
        </Collapse.Panel>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}
