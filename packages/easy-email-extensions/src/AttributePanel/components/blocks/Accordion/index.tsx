
import React from 'react';
import { useEditorProps, useFocusIdx } from 'easy-email-editor';
import { AttributesPanelWrapper } from '@extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { BackgroundColor } from '@extensions/AttributePanel/components/attributes/BackgroundColor';
import { FontFamily } from '@extensions/AttributePanel/components/attributes/FontFamily';
import { Padding } from '@extensions/AttributePanel/components/attributes/Padding';
import {
  ImageUploaderField,
  InputWithUnitField,
  RadioGroupField,
  SelectField,
  TextField,
} from '@extensions/components/Form';
import { Collapse, Row, Col, Space } from 'antd';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';

const positionOptions = [
  {
    value: 'left',
    get label() {
      return t('Left');
    },
  },
  {
    value: 'right',
    get label() {
      return t('Right');
    },
  },
];

const alignOptions = [
  {
    value: 'top',
    get label() {
      return t('top');
    },
  },
  {
    value: 'middle',
    get label() {
      return t('middle');
    },
  },
  {
    value: 'bottom',
    get label() {
      return t('bottom');
    },
  },
];

export function Accordion() {
  const { focusIdx } = useFocusIdx();
  const { onUploadImage } = useEditorProps();

  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['0', '1', '2']}>
        <Collapse.Panel
          key='0'
          header={t('Setting')}
        >
          <Space orientation='vertical' size='small'>
            <Row>
              <Col span={11}>
                <BackgroundColor />
              </Col>
              <Col
                offset={1}
                span={11}
              >
                <FontFamily />
              </Col>
            </Row>

            <Padding />

            <Row>
              <Col span={11}>
                <InputWithUnitField
                  label={t('Icon width')}
                  name={`${focusIdx}.attributes.icon-width`}
                />
              </Col>
              <Col
                offset={1}
                span={11}
              >
                <InputWithUnitField
                  label={t('Icon height')}
                  name={`${focusIdx}.attributes.icon-height`}
                />
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <ImageUploaderField
                  label={t('Unwrapped icon')}
                  name={`${focusIdx}.attributes.icon-unwrapped-url`}
                  //helpText={t('The image suffix should be .jpg, jpeg, png, gif, etc. Otherwise, the picture may not be displayed normally.')}
                  uploadHandler={onUploadImage}
                />
              </Col>
              <Col
                offset={1}
                span={11}
              >
                <ImageUploaderField
                  label={t('Wrapped icon')}
                  name={`${focusIdx}.attributes.icon-wrapped-url`}
                  uploadHandler={onUploadImage}
                />
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <RadioGroupField
                  label={t('Icon position')}
                  name={`${focusIdx}.attributes.icon-position`}
                  options={positionOptions}
                />
              </Col>
              <Col
                offset={1}
                span={11}
              >
                <SelectField
                  style={{ width: 120 }}
                  label={t('Icon align')}
                  name={`${focusIdx}.attributes.icon-align`}
                  options={alignOptions}
                />
              </Col>
            </Row>

            <TextField
              label={t('Border')}
              name={`${focusIdx}.attributes.border`}
            />
          </Space>
        </Collapse.Panel>
        <Collapse.Panel
          key='4'
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
