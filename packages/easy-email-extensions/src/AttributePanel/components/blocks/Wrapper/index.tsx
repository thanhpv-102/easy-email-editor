import React from 'react';
import { Padding } from '@extensions/AttributePanel/components/attributes//Padding';
import { Background } from '@extensions/AttributePanel/components/attributes//Background';
import { TextField } from '@extensions/components/Form';
import { AttributesPanelWrapper } from '@extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Col, Collapse } from 'antd';
import { Stack, useFocusIdx } from 'easy-email-editor';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';

export function Wrapper() {
  const { focusIdx } = useFocusIdx();
  return (
    <AttributesPanelWrapper style={{ padding: 0 }}>
      <CollapseWrapper defaultActiveKey={['0', '1', '2']}>
        <Collapse.Panel key="0" header={t('Dimension')}>
          <Stack vertical spacing="tight">
            <Padding />
          </Stack>
        </Collapse.Panel>
        <Collapse.Panel key="1" header={t('Background')}>
          <Stack vertical spacing="tight">
            <Background />
          </Stack>
        </Collapse.Panel>
        <Collapse.Panel key="2" header={t('Border')}>
          <Stack vertical spacing="tight">
            <TextField
              label={t('Border')}
              name={`${focusIdx}.attributes.border`}
              inline
            />
            <TextField
              label={t('Background border radius')}
              name={`${focusIdx}.attributes.border-radius`}
              inline
            />
          </Stack>
        </Collapse.Panel>
        <Collapse.Panel key="4" header={t('Extra')}>
          <Col span={24}>
            <ClassName />
          </Col>
        </Collapse.Panel>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}
