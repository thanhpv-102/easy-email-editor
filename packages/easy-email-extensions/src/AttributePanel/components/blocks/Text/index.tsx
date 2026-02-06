import React, { useState } from 'react';
import { Padding } from '@extensions/AttributePanel/components/attributes/Padding';
import { TextDecoration } from '@extensions/AttributePanel/components/attributes/TextDecoration';
import { FontWeight } from '@extensions/AttributePanel/components/attributes/FontWeight';
import { FontStyle } from '@extensions/AttributePanel/components/attributes/FontStyle';
import { FontFamily } from '@extensions/AttributePanel/components/attributes/FontFamily';
import { Height } from '@extensions/AttributePanel/components/attributes/Height';
import { ContainerBackgroundColor } from '@extensions/AttributePanel/components/attributes/ContainerBackgroundColor';
import { FontSize } from '@extensions/AttributePanel/components/attributes/FontSize';
import { Color } from '@extensions/AttributePanel/components/attributes/Color';
import { Align } from '@extensions/AttributePanel/components/attributes/Align';
import { LineHeight } from '@extensions/AttributePanel/components/attributes/LineHeight';
import { LetterSpacing } from '@extensions/AttributePanel/components/attributes/LetterSpacing';

import { AttributesPanelWrapper } from '@extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Button, Col, Collapse, Row, Space, Tooltip } from 'antd';
import { IconFont } from 'easy-email-editor';
import { HtmlEditor } from '../../UI/HtmlEditor';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';

export function Text() {
  const [visible, setVisible] = useState(false);

  return (
    <AttributesPanelWrapper
      extra={(
        <Tooltip title={t('Html mode')}>
          <Button
            onClick={() => setVisible(true)}
            icon={<IconFont iconName="icon-html" />}
          />
        </Tooltip>
      )}
    >
      <CollapseWrapper defaultActiveKey={['0', '1', '2']}>
        <Collapse.Panel
          key="0"
          header={t('Dimension')}
        >
          <Space orientation="vertical" size="small">
            <Height />
            <Padding showResetAll />
          </Space>
        </Collapse.Panel>
        <Collapse.Panel
          key="1"
          header={t('Color')}
        >
          <Row>
            <Col span={11}>
              <Color />
            </Col>
            <Col
              offset={1}
              span={11}
            >
              <ContainerBackgroundColor title={t('Background color')} />
            </Col>
          </Row>
        </Collapse.Panel>
        <Collapse.Panel
          key="2"
          header={t('Typography')}
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
                <LineHeight />
              </Col>
              <Col
                offset={1}
                span={11}
              >
                <LetterSpacing />
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
                <FontWeight />
              </Col>
            </Row>

            <Align />

            <FontStyle />

            <Row>
              <Col span={11} />
              <Col
                offset={1}
                span={11}
              />
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
      <HtmlEditor
        visible={visible}
        setVisible={setVisible}
      />
    </AttributesPanelWrapper>
  );
}
