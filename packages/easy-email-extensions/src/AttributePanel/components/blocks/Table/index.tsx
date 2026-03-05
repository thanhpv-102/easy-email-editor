import { AttributesPanelWrapper } from '@extensions/AttributePanel';
import { Collapse } from 'antd';
import { Stack, useFocusIdx } from 'easy-email-editor';
import React from 'react';
import { t } from 'easy-email-core';
import { Border } from '../../attributes/Border';
import { Color } from '../../attributes/Color';
import { ContainerBackgroundColor } from '../../attributes/ContainerBackgroundColor';
import { FontFamily } from '../../attributes/FontFamily';
import { FontSize } from '../../attributes/FontSize';
import { FontStyle } from '../../attributes/FontStyle';
import { Padding } from '../../attributes/Padding';
import { TextAlign } from '../../attributes/TextAlign';
import { Width } from '../../attributes/Width';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { TextField } from '@extensions/components/Form';
export function Table() {
  const { focusIdx } = useFocusIdx();
  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['.$0']}>
        <Collapse.Panel
          key="0"
          header={t('Content')}
        >
          <TextField
            label={t('Content')}
            name={`${focusIdx}.data.value.content`}
            type='textarea'
            placeholder="Enter HTML table content"
          />
        </Collapse.Panel>
        <Collapse.Panel
          key="1"
          header={t('Dimension')}
        >
          <Stack>
            <Width />
          </Stack>
          <Stack vertical>
            <Padding />
          </Stack>
        </Collapse.Panel>
        <Collapse.Panel
          key="2"
          header={t('Decoration')}
        >
          <Color />
          <ContainerBackgroundColor />
          <Border />
        </Collapse.Panel>
        <Collapse.Panel
          key="3"
          header={t('Typography')}
        >
          <Stack>
            <FontFamily />
            <FontSize />
          </Stack>
          <FontStyle />
          <TextAlign />
        </Collapse.Panel>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}

