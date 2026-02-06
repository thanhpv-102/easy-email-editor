import React from 'react';
import { Col, Collapse, Row, Space } from 'antd';
import { AttributesPanelWrapper } from '@extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Padding } from '@extensions/AttributePanel/components/attributes/Padding';
import { Width } from '@extensions/AttributePanel/components/attributes/Width';
import { VerticalAlign } from '@extensions/AttributePanel/components/attributes/VerticalAlign';
import { Border } from '@extensions/AttributePanel/components/attributes/Border';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { BackgroundColor } from '../../attributes';

export function Column() {
  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['0', '1', '2']}>
        <Collapse.Panel
          key="0"
          header={t('Dimension')}
        >
          <Space orientation="vertical" size="small">
            <Row>
              <Col span={11}>
                <Width />
              </Col>
              <Col
                offset={1}
                span={11}
              >
                <VerticalAlign />
              </Col>
            </Row>

            <Padding />
          </Space>
        </Collapse.Panel>
        <Collapse.Panel
          key="1"
          header={t('Background')}
        >
          <BackgroundColor />
        </Collapse.Panel>
        <Collapse.Panel
          key="2"
          header={t('Border')}
        >
          <Border />
        </Collapse.Panel>
        <Collapse.Panel
          key="4"
          header={t('Extra')}
        >
          <Col span={24}>
            <ClassName />
          </Col>
        </Collapse.Panel>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}
