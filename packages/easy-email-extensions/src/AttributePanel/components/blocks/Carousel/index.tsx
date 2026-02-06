import React from 'react';
import {
  ColorPickerField,
  EditTabField,
  ImageUploaderField,
  InputWithUnitField,
  RadioGroupField,
  SelectField,
  TextField,
} from '@extensions/components/Form';
import { Col, Collapse, Row, Space } from 'antd';
import { Stack, useEditorProps, useFocusIdx } from 'easy-email-editor';
import { AttributesPanelWrapper } from '@extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Align } from '@extensions/AttributePanel/components/attributes/Align';
import { ICarousel } from 'easy-email-core';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { LinkOutlined } from '@ant-design/icons';

const options = [
  {
    value: 'hidden',
    get label() {
      return t('hidden');
    },
  },
  {
    value: 'visible',
    get label() {
      return t('visible');
    },
  },
];

export function Carousel() {
  const { focusIdx } = useFocusIdx();
  return (
    <AttributesPanelWrapper style={{ padding: 0 }}>
      <CollapseWrapper defaultActiveKey={['0', '1', '2', '3', '4']}>
        <Collapse.Panel
          key="0"
          header={t('Dimension')}
        >
          <Space orientation="vertical" size="small">
            <InputWithUnitField
              label={t('Thumbnail width')}
              name={`${focusIdx}.attributes.tb-width`}
              quickchange
              inline
            />

            <RadioGroupField
              label={t('Thumbnails')}
              name={`${focusIdx}.attributes.thumbnails`}
              options={options}
              inline
            />
            <Align inline />
          </Space>
        </Collapse.Panel>
        <Collapse.Panel
          key="4"
          header={t('Images')}
        >
          <Stack
            vertical
            spacing="tight"
          >
            <EditTabField
              tabPlacement="top"
              name={`${focusIdx}.data.value.images`}
              label=""
              labelHidden
              renderItem={(item: unknown, index: number) => (
                <CarouselImage
                  item={item as ICarousel['data']['value']['images'][number]}
                  index={index}
                />
              )}
              additionItem={{
                src: 'https://www.mailjet.com/wp-content/uploads/2016/11/ecommerce-guide.jpg',
                target: '_blank',
              }}
            />
          </Stack>
        </Collapse.Panel>
        <Collapse.Panel
          key="3"
          header={t('Icon')}
        >
          <Row>
            <Col span={11}>
              <TextField
                label={t('Left icon')}
                name={`${focusIdx}.attributes.left-icon`}
              />
            </Col>
            <Col
              offset={1}
              span={11}
            >
              <TextField
                label={t('Right icon')}
                name={`${focusIdx}.attributes.right-icon`}
              />
            </Col>
          </Row>

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
            />
          </Row>
        </Collapse.Panel>

        <Collapse.Panel
          key="1"
          header={t('Border')}
        >
          <Row>
            <Col span={11}>
              <ColorPickerField
                label={t('Hovered border')}
                name={`${focusIdx}.attributes.tb-hover-border-color`}
              />
            </Col>
            <Col
              offset={1}
              span={11}
            >
              <ColorPickerField
                label={t('Selected Border')}
                name={`${focusIdx}.attributes.tb-selected-border-color`}
              />
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <TextField
                label={t('Border of the thumbnails')}
                name={`${focusIdx}.attributes.tb-border`}
              />
            </Col>
            <Col
              offset={1}
              span={11}
            >
              <TextField
                label={t('Border radius of the thumbnails')}
                name={`${focusIdx}.attributes.tb-border-radius`}
              />
            </Col>
          </Row>
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

function CarouselImage({
  index,
}: {
  item: ICarousel['data']['value']['images'][number];
  index: number;
}) {
  const { focusIdx } = useFocusIdx();
  const { onUploadImage } = useEditorProps();
  return (
    <Space orientation="vertical" size="small">
      <ImageUploaderField
        label={t('Image')}
        labelHidden
        name={`${focusIdx}.data.value.images.[${index}].src`}
        helpText={t(
          'The image suffix should be .jpg, jpeg, png, gif, etc. Otherwise, the picture may not be displayed normally.',
        )}
        uploadHandler={onUploadImage}
      />
      <Row>
        <Col span={11}>
          <TextField
            prefix={<LinkOutlined />}
            label={t('Url')}
            name={`${focusIdx}.data.value.images.[${index}].href`}
          />
        </Col>
        <Col
          offset={1}
          span={11}
        >
          <SelectField
            label={t('Target')}
            name={`${focusIdx}.data.value.images.[${index}].target`}
            options={[
              {
                value: '',
                label: t('_self'),
              },
              {
                value: '_blank',
                label: t('_blank'),
              },
            ]}
          />
        </Col>
      </Row>

      <TextField
        label={t('Title')}
        name={`${focusIdx}.data.value.images.[${index}].title`}
      />
    </Space>
  );
}
