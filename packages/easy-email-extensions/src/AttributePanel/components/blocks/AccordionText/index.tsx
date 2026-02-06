import React from 'react';
import { useFocusIdx } from 'easy-email-editor';

import { Padding } from '../../attributes/Padding';
import { BackgroundColor } from '../../attributes/BackgroundColor';
import { Color } from '../../attributes/Color';
import { TextAreaField } from '../../../../components/Form';
import { FontSize } from '../../attributes/FontSize';
import { FontWeight } from '../../attributes/FontWeight';
import { FontFamily } from '../../attributes/FontFamily';
import { LineHeight } from '../../attributes/LineHeight';
import { AttributesPanelWrapper } from '../../attributes/AttributesPanelWrapper';
import { Col, Collapse, Row, Space } from 'antd';

export function AccordionText() {
  const { focusIdx } = useFocusIdx();

  return (
    <AttributesPanelWrapper>
      <Collapse defaultActiveKey={['0', '1', '2']}>
        <Collapse.Panel key="0" header={t('Setting')}>
          <Space orientation="vertical" size="small">
            <TextAreaField
              label={t('Content')}
              name={`${focusIdx}.data.value.content`}
              autoSize={{ minRows: 5 }}
            />
            <Row>
              <Col span={11}>
                <Color />
              </Col>
              <Col offset={1} span={11}>
                <FontSize />
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <LineHeight />
              </Col>
              <Col offset={1} span={11}>
                <FontWeight />
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <FontFamily />
              </Col>
              <Col offset={1} span={11}>
                <BackgroundColor />
              </Col>
            </Row>

            <Padding title={t('Padding')} attributeName="padding" />
          </Space>
        </Collapse.Panel>
      </Collapse>
    </AttributesPanelWrapper>
  );
}
