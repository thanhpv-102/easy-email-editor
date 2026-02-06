import React, { useMemo } from 'react';
import { Padding } from '@extensions/AttributePanel/components/attributes/Padding';
import {
  EditGridTabField,
  ImageUploaderField,
  InputWithUnitField,
  RadioGroupField,
  TextField,
} from '@extensions/components/Form';
import { Align } from '@extensions/AttributePanel/components/attributes/Align';
import { Color } from '@extensions/AttributePanel/components/attributes/Color';
import { ContainerBackgroundColor } from '@extensions/AttributePanel/components/attributes/ContainerBackgroundColor';
import { FontFamily } from '@extensions/AttributePanel/components/attributes/FontFamily';
import { FontSize } from '@extensions/AttributePanel/components/attributes/FontSize';
import { FontStyle } from '@extensions/AttributePanel/components/attributes/FontStyle';
import { FontWeight } from '@extensions/AttributePanel/components/attributes/FontWeight';

import { AttributesPanelWrapper } from '@extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Col, Collapse, Row, Space } from 'antd';
import { TextDecoration } from '@extensions/AttributePanel/components/attributes/TextDecoration';
import { LineHeight } from '@extensions/AttributePanel/components/attributes/LineHeight';
import { useBlock, useEditorProps, useFocusIdx } from 'easy-email-editor';
import { ISocial } from 'easy-email-core';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { LinkOutlined } from '@ant-design/icons';

const options = [
  {
    value: 'vertical',
    get label() {
      return 'vertical';
    },
  },
  {
    value: 'horizontal',
    get label() {
      return 'horizontal';
    },
  },
];

export function Social() {
  const { focusIdx } = useFocusIdx();
  const { focusBlock } = useBlock();
  const value = focusBlock?.data.value as ISocial['data']['value'];
  if (!value) return null;

  return (
    <AttributesPanelWrapper style={{ padding: 0 }}>
      <CollapseWrapper defaultActiveKey={['0', '1', '2', '3']}>
        <Collapse.Panel
          key="1"
          header={'Setting'}
        >
          <Space orientation="vertical" size="small">
            <RadioGroupField
              label={'Mode'}
              name={`${focusIdx}.attributes.mode`}
              options={options}
            />

            <Align />
          </Space>
        </Collapse.Panel>

        <Collapse.Panel
          key="3"
          header={'Typography'}
        >
          <Space orientation="vertical" size="small">
            <Row>
              <Col span={11}>
                <FontFamily />
              </Col>
              <Col
                offset={1}
                span={11}
              >
                <FontSize />
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <FontWeight />
              </Col>
              <Col
                offset={1}
                span={11}
              >
                <LineHeight />
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Color />
              </Col>
              <Col
                offset={1}
                span={11}
              >
                <ContainerBackgroundColor title={'Background color'} />
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <TextDecoration />
              </Col>
              <Col
                offset={1}
                span={11}
              >
                <FontStyle />
              </Col>
            </Row>
          </Space>
        </Collapse.Panel>

        <Collapse.Panel
          key="2"
          header={t('Social item')}
        >
          <EditGridTabField
            tabPlacement="top"
            name={`${focusIdx}.data.value.elements`}
            label=""
            labelHidden
            renderItem={(item, index: number) => (
              <SocialElement
                item={item as ISocial['data']['value']['elements'][number]}
                index={index}
              />
            )}
          />
        </Collapse.Panel>

        <Collapse.Panel
          key="0"
          header={t('Dimension')}
        >
          <Space
            orientation="vertical"
            size="large"
          >
            <Row>
              <Col span={11}>
                <InputWithUnitField
                  label={t('Icon width')}
                  name={`${focusIdx}.attributes.icon-size`}
                />
              </Col>
              <Col
                offset={1}
                span={11}
              >
                <TextField
                  label={t('Border radius')}
                  name={`${focusIdx}.attributes.border-radius`}
                />
              </Col>
            </Row>

            <Padding />
            <Padding
              attributeName="inner-padding"
              title={t('Icon padding')}
            />
            <Padding
              attributeName="text-padding"
              title={t('Text padding')}
            />
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

function SocialElement({
  index,
}: {
  item: ISocial['data']['value']['elements'][0];
  index: number;
}) {
  const { focusIdx } = useFocusIdx();
  const { onUploadImage, socialIcons } = useEditorProps();

  const autoCompleteOptions = useMemo(() => {
    if (!socialIcons) return undefined;
    return socialIcons.map(icon => {
      return {
        label: icon.content,
        value: icon.image,
      };
    });
  }, [socialIcons]);

  return (
    <Space orientation="vertical" size="small">
      <ImageUploaderField
        label={t('Image')}
        autoCompleteOptions={autoCompleteOptions}
        labelHidden
        name={`${focusIdx}.data.value.elements.[${index}].src`}
        //helpText={t('The image suffix should be .jpg, jpeg, png, gif, etc. Otherwise, the picture may not be displayed normally.')}
        uploadHandler={onUploadImage}
      />

      <Row>
        <Col span={11}>
          <TextField
            label={t('Content')}
            name={`${focusIdx}.data.value.elements.[${index}].content`}
            quickchange
          />
        </Col>
        <Col
          offset={1}
          span={11}
        >
          <TextField
            prefix={<LinkOutlined />}
            label={t('Link')}
            name={`${focusIdx}.data.value.elements.[${index}].href`}
          />
        </Col>
      </Row>
      {/* <Row>
        <Col span={11}>
          <InputWithUnitField
            label={t('Icon width')}
            name={`${focusIdx}.data.value.elements.[${index}].icon-size`}
          />
        </Col>
        <Col offset={1} span={11}>
          <InputWithUnitField
            label={t('Icon height')}
            name={`${focusIdx}.data.value.elements.[${index}].icon-height`}
          />
        </Col>
      </Row> */}
    </Space>
  );
}
