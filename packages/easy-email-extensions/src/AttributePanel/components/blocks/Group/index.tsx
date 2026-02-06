import React from 'react';
import { Width } from '@extensions/AttributePanel/components/attributes/Width';
import { BackgroundColor } from '@extensions/AttributePanel/components/attributes/BackgroundColor';
import { VerticalAlign } from '@extensions/AttributePanel/components/attributes/VerticalAlign';
import { Col, Collapse, Row } from 'antd';
import { AttributesPanelWrapper } from '@extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';

export function Group() {
  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['0', '1', '2']}>
        <Collapse.Panel key="0" header={t('Dimension')}>
          <Row>
            <Col span={11}>
              <Width />
            </Col>
            <Col offset={1} span={11}>
              <VerticalAlign />
            </Col>
          </Row>
        </Collapse.Panel>
        <Collapse.Panel key="1" header={t('Background')}>
          <Row>
            <Col span={11}>
              <BackgroundColor />
            </Col>
            <Col offset={1} span={11} />
          </Row>
        </Collapse.Panel>
        <Collapse.Panel key="4" header={t('Extra')}>
          <Col span={24}>
            <ClassName />
          </Col>
        </Collapse.Panel>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}
