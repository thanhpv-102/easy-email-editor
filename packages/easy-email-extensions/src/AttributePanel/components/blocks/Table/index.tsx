import { AttributesPanelWrapper } from '@extensions/AttributePanel';
import { Button, Collapse, Tooltip } from 'antd';
import { IconFont, Stack } from 'easy-email-editor';
import React, { useState } from 'react';
import { Border } from '../../attributes/Border';
import { Color } from '../../attributes/Color';
import { ContainerBackgroundColor } from '../../attributes/ContainerBackgroundColor';
import { FontFamily } from '../../attributes/FontFamily';
import { FontSize } from '../../attributes/FontSize';
import { FontStyle } from '../../attributes/FontStyle';
import { Padding } from '../../attributes/Padding';
import { TextAlign } from '../../attributes/TextAlign';
import { Width } from '../../attributes/Width';
import { HtmlEditor } from '../../UI/HtmlEditor';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';

export function Table() {
  const [visible, setVisible] = useState(false);

  return (
    <AttributesPanelWrapper
      extra={
        (
          <Tooltip title={'Edit'}>
            <Button
              onClick={() => setVisible(true)}
              icon={<IconFont iconName="icon-html" />}
            />
          </Tooltip>
        )
      }
    >
      <CollapseWrapper defaultActiveKey={['-1', '0', '1', '2', '3']}>
        <Collapse.Panel
          key="1"
          header={'Dimension'}
        >
          <Stack>
            <Width />
            <Stack.Item />
          </Stack>
          <Stack vertical>
            <Padding />
          </Stack>
        </Collapse.Panel>

        <Collapse.Panel
          key="2"
          header={'Decoration'}
        >
          <Color />
          <ContainerBackgroundColor />
          <Border />
        </Collapse.Panel>

        <Collapse.Panel
          key="2"
          header={'Typography'}
        >
          <Stack>
            <FontFamily />
            <FontSize />
          </Stack>
          <FontStyle />
          <TextAlign />
        </Collapse.Panel>
      </CollapseWrapper>
      <HtmlEditor
        visible={visible}
        setVisible={setVisible}
      />
    </AttributesPanelWrapper>
  );
}
