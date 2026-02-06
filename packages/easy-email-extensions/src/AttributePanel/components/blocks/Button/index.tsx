import React from 'react';
import { Padding } from '../../attributes/Padding';
import { Border } from '../../attributes/Border';
import { BackgroundColor } from '../../attributes/BackgroundColor';
import { Color } from '../../attributes/Color';
import { Link } from '../../attributes/Link';
import { Width } from '../../attributes/Width';
import { ContainerBackgroundColor } from '../../attributes/ContainerBackgroundColor';
import { Align } from '../../attributes/Align';
import { FontSize } from '../../attributes/FontSize';
import { FontStyle } from '../../attributes/FontStyle';
import { FontWeight } from '../../attributes/FontWeight';
import { FontFamily } from '../../attributes/FontFamily';
import { TextDecoration } from '../../attributes/TextDecoration';
import { LineHeight } from '../../attributes/LineHeight';
import { LetterSpacing } from '../../attributes/LetterSpacing';
import { Col, Collapse, Popover, Row, Space, Button as AntButton } from 'antd';
import { TextField } from '../../../../components/Form';
import { IconFont, useEditorProps, useField, useFocusIdx } from 'easy-email-editor';
import { AttributesPanelWrapper } from '../../attributes/AttributesPanelWrapper';
import { MergeTags } from '../../attributes';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';

export function Button() {
  const { focusIdx } = useFocusIdx();
  const { input } = useField(`${focusIdx}.data.value.content`, {
    parse: (v: string) => v,
  });

  const { mergeTags } = useEditorProps();

  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['-1', '0', '1', '2', '3']}>
        <Collapse.Panel
          key="-1"
          header={'Setting'}
        >
          <Space orientation="vertical" size="small">
            <TextField
              label={(
                <Space>
                  <span>{'Content'}</span>
                  {mergeTags && (
                    <Popover
                      trigger="click"
                      content={(
                        <MergeTags
                          value={input.value || ''}
                          onChange={input.onChange}
                        />
                      )}
                    >
                      <AntButton
                        type="text"
                        icon={<IconFont iconName="icon-merge-tags" />}
                      />
                    </Popover>
                  )}
                </Space>
              )}
              name={`${focusIdx}.data.value.content`}
            />
            <Link />
          </Space>
        </Collapse.Panel>

        <Collapse.Panel
          key="0"
          header={'Dimension'}
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
                <FontWeight />
              </Col>
            </Row>

            <Padding
              title={'Padding'}
              attributeName="padding"
              showResetAll
            />
            <Padding
              title={'Inner padding'}
              attributeName="inner-padding"
            />
          </Space>
        </Collapse.Panel>

        <Collapse.Panel
          key="1"
          header={'Color'}
        >
          <Space orientation="vertical" size="small">
            <Row>
              <Col span={11}>
                <Color title={'Text color'} />
              </Col>
              <Col
                offset={1}
                span={11}
              >
                <BackgroundColor title={'Button color'} />
              </Col>
              <Col span={11}>
                <ContainerBackgroundColor title={'Background color'} />
              </Col>
            </Row>
          </Space>
        </Collapse.Panel>

        <Collapse.Panel
          key="2"
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
                <TextDecoration />
              </Col>
              <Col
                offset={1}
                span={11}
              >
                <LetterSpacing />
              </Col>
            </Row>
            <Align />

            <FontStyle />
          </Space>
        </Collapse.Panel>

        <Collapse.Panel
          key="3"
          header={'Border'}
        >
          <Border />
        </Collapse.Panel>
        <Collapse.Panel
          key="4"
          header={'Extra'}
        >
          <Col span={24}>
            <ClassName />
          </Col>
        </Collapse.Panel>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}
