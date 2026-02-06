import React from 'react';
import { Padding } from '../../attributes/Padding';

import { BackgroundColor } from '../../attributes/BackgroundColor';
import { Color } from '../../attributes/Color';
import { TextAreaField } from '../../../../components/Form';
import { FontSize } from '../../attributes/FontSize';
import { FontWeight } from '../../attributes/FontWeight';
import { FontFamily } from '../../attributes/FontFamily';
import { AttributesPanelWrapper } from '../../attributes/AttributesPanelWrapper';
import { useFocusIdx } from 'easy-email-editor';
import { Col, Collapse, Row, Space } from 'antd';

export function AccordionTitle() {
  const { focusIdx } = useFocusIdx();
  return (
    <AttributesPanelWrapper>
      <Collapse defaultActiveKey={['0', '1', '2']}>
        <Collapse.Panel key="0" header={'Setting'}>
          <Space orientation="vertical" size="small">
            <TextAreaField
              label={'Content'}
              name={`${focusIdx}.data.value.content`}
            />

            <Row>
              <Col span={11}>
                <Color />
              </Col>
              <Col offset={1} span={11}>
                <BackgroundColor />
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <FontSize />
              </Col>
              <Col offset={1} span={11}>
                <FontFamily />
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <FontWeight />
              </Col>
              <Col offset={1} span={11} />
            </Row>

            <Padding title={'Padding'} attributeName="padding" />
          </Space>
        </Collapse.Panel>
      </Collapse>
    </AttributesPanelWrapper>
  );
}
