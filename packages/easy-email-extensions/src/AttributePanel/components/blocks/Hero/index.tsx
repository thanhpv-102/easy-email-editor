import React from 'react';
import { BackgroundColor } from '@extensions/AttributePanel/components/attributes/BackgroundColor';
import { ImageUploaderField, InputWithUnitField, RadioGroupField, TextField } from '@extensions/components/Form';
import { Width } from '@extensions/AttributePanel/components/attributes/Width';
import { Height } from '@extensions/AttributePanel/components/attributes/Height';
import { VerticalAlign } from '@extensions/AttributePanel/components/attributes/VerticalAlign';
import { Padding } from '@extensions/AttributePanel/components/attributes/Padding';
import { Col, Collapse, Row, Space } from 'antd';
import { useEditorProps, useFocusIdx } from 'easy-email-editor';
import { AttributesPanelWrapper } from '@extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';

const options = [
  {
    value: 'fluid-height',
    get label() {
      return t('Fluid height');
    },
  },
  {
    value: 'fixed-height',
    get label() {
      return t('Fixed height');
    },
  },
];

export function Hero() {
  const { focusIdx } = useFocusIdx();
  const { onUploadImage } = useEditorProps();

  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['0', '1', '2']}>
        <Collapse.Panel
          key="0"
          header={t('Dimension')}
        >
          <Space orientation="vertical" size="small">
            <RadioGroupField
              label={t('Mode')}
              name={`${focusIdx}.attributes.mode`}
              key={`${focusIdx}.attributes.mode`}
              options={options}
            />
            <Row>
              <Col span={11}>
                <Width />
              </Col>
              <Col
                offset={1}
                span={11}
              >
                <Height />
              </Col>
            </Row>

            <Padding />
            <VerticalAlign />
          </Space>
        </Collapse.Panel>
        <Collapse.Panel
          key="1"
          header={t('Background')}
        >
          <Space orientation="vertical" size="small">
            <ImageUploaderField
              label={t('src')}
              name={`${focusIdx}.attributes.background-url`}
              key={`${focusIdx}.attributes.background-url`}
              helpText={t(
                'The image suffix should be .jpg, jpeg, png, gif, etc. Otherwise, the picture may not be displayed normally.',
              )}
              uploadHandler={onUploadImage}
            />

            <Row>
              <Col span={11}>
                <InputWithUnitField
                  label={t('Background width')}
                  name={`${focusIdx}.attributes.background-width`}
                />
              </Col>
              <Col
                offset={1}
                span={11}
              >
                <InputWithUnitField
                  label={t('Background height')}
                  name={`${focusIdx}.attributes.background-height`}
                />
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <TextField
                  label={t('Background position')}
                  name={`${focusIdx}.attributes.background-position`}
                />
              </Col>
              <Col
                offset={1}
                span={11}
              >
                <InputWithUnitField
                  label={t('Border radius')}
                  name={`${focusIdx}.attributes.border-radius`}
                  unitOptions="percent"
                />
              </Col>
              <Col span={11}>
                <BackgroundColor />
              </Col>
            </Row>
          </Space>
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
