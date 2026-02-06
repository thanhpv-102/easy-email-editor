import React from 'react';
import { ColorPickerField, EditTabField, SelectField, TextField } from '@extensions/components/Form';
import { Align } from '@extensions/AttributePanel/components/attributes/Align';
import { AttributesPanelWrapper } from '@extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Col, Collapse, Row, Space } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { NavbarLinkPadding } from '@extensions/AttributePanel/components/attributes/NavbarLinkPadding';
import { Stack, useFocusIdx } from 'easy-email-editor';
import { INavbar } from 'easy-email-core';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import {
  FontFamily,
  FontStyle,
  FontWeight,
  LetterSpacing,
  LineHeight,
  TextDecoration,
  TextTransform,
} from '../../attributes';
import { pixelAdapter } from '../../adapter';

export function Navbar() {
  const { focusIdx } = useFocusIdx();
  return (
    <AttributesPanelWrapper style={{ padding: 0 }}>
      <CollapseWrapper defaultActiveKey={['0', '1', '2']}>
        <Collapse.Panel
          key="0"
          header={t('Layout')}
        >
          <Stack
            vertical
            spacing="tight"
          >
            <Align />
          </Stack>
        </Collapse.Panel>

        <Collapse.Panel
          key="1"
          header={t('Navbar links')}
        >
          <Space
            orientation="vertical"
            style={{ width: '100%' }}
          >
            <EditTabField
              tabPlacement="top"
              name={`${focusIdx}.data.value.links`}
              label={t('Links')}
              labelHidden
              renderItem={(item: unknown, index: number) => (
                <NavbarLink
                  item={item as INavbar['data']['value']['links'][number]}
                  index={index}
                />
              )}
              additionItem={{
                src: 'https://www.mailjet.com/wp-content/uploads/2016/11/ecommerce-guide.jpg',
                target: '_blank',
                content: 'New link',
                color: '#1890ff',
                'font-size': '13px',
              }}
            />
            <div />
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

function NavbarLink({
  index,
}: {
  item: INavbar['data']['value']['links'][number];
  index: number;
}) {
  const { focusIdx } = useFocusIdx();
  return (
    <div className="NavbarLink">
      <Space
        orientation="vertical"
        style={{ width: '100%' }}
      >
        <Row>
          <Col span={11}>
            <TextField
              label={t('Content')}
              name={`${focusIdx}.data.value.links.[${index}].content`}
            />
          </Col>
          <Col
            offset={1}
            span={11}
          >
            <ColorPickerField
              label={t('Color')}
              name={`${focusIdx}.data.value.links.[${index}].color`}
            />
          </Col>
        </Row>

        <Row>
          <Col span={11}>
            <FontFamily name={`${focusIdx}.data.value.links.[${index}].font-family`} />
          </Col>
          <Col
            offset={1}
            span={11}
          >
            <TextField
              label={t('Font size (px)')}
              name={`${focusIdx}.data.value.links.[${index}].font-size`}
              config={pixelAdapter}
              autoComplete="off"
            />
          </Col>
        </Row>

        <Row>
          <Col span={11}>
            <LineHeight name={`${focusIdx}.data.value.links.[${index}].line-height`} />
          </Col>
          <Col
            offset={1}
            span={11}
          >
            <LetterSpacing
              name={`${focusIdx}.data.value.links.[${index}].letter-spacing`}
            />
          </Col>
        </Row>

        <Row>
          <Col span={11}>
            <TextDecoration
              name={`${focusIdx}.data.value.links.[${index}].text-decoration`}
            />
          </Col>
          <Col
            offset={1}
            span={11}
          >
            <FontWeight name={`${focusIdx}.data.value.links.[${index}].font-weight`} />
          </Col>
        </Row>

        <Row>
          <Col span={11}>
            <TextTransform
              name={`${focusIdx}.data.value.links.[${index}].text-transform`}
            />
          </Col>
          <Col
            offset={1}
            span={11}
          />
        </Row>
        <FontStyle name={`${focusIdx}.data.value.links.[${index}].font-style`} />
        <Row>
          <Col span={11}>
            <TextField
              prefix={<LinkOutlined />}
              label={<span>{t('Url')}</span>}
              name={`${focusIdx}.data.value.links.[${index}].href`}
            />
          </Col>
          <Col
            offset={1}
            span={11}
          >
            <SelectField
              style={{ minWidth: 65 }}
              label={t('Target')}
              name={`${focusIdx}.data.value.links.[${index}].target`}
              options={[
                {
                  value: '_blank',
                  label: t('_blank'),
                },
                {
                  value: '_self',
                  label: t('_self'),
                },
              ]}
            />
          </Col>
        </Row>
        <NavbarLinkPadding
          name={`${focusIdx}.data.value.links.[${index}].padding`}
        />
        <div />
      </Space>
    </div>
  );
}
