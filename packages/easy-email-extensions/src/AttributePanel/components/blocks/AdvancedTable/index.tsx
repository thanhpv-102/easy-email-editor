import { AttributesPanelWrapper } from '@extensions/AttributePanel';
import { Collapse } from 'antd';
import { Stack, useFocusIdx } from 'easy-email-editor';
import React from 'react';
import { t } from 'easy-email-core';
import { Color } from '../../attributes/Color';
import { ContainerBackgroundColor } from '../../attributes/ContainerBackgroundColor';
import { FontFamily } from '../../attributes/FontFamily';
import { FontSize } from '../../attributes/FontSize';
import { Padding } from '../../attributes/Padding';
import { Width } from '../../attributes/Width';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { ColorPickerField, NumberField, SelectField, TextField } from '@extensions';
import { pixelAdapter } from '../../adapter';

export function AdvancedTable() {
  const { focusIdx } = useFocusIdx();
  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['0', '1', '2', '3']}>
        <Collapse.Panel
          key="0"
          header={t('Table Settings')}
        >
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
            {t('Click on the table to edit cells, right click for add/remove rows and columns')}
          </div>
          <NumberField
            label={t('Cell padding (px)')}
            name={`${focusIdx}.attributes.cellPadding`}
            config={pixelAdapter}
            max={50}
            min={0}
            step={1}
          />
          <ColorPickerField
            label={t('Cell border color')}
            name={`${focusIdx}.attributes.cellBorderColor`}
            key={`${focusIdx}.attributes.cellBorderColor`}
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
          <TextField
            label={t('Table border')}
            name={`${focusIdx}.attributes.border`}
          />
        </Collapse.Panel>

        <Collapse.Panel
          key="3"
          header={t('Typography')}
        >
          <Stack>
            <FontFamily />
            <FontSize />
          </Stack>
          <Stack>
            <SelectField
              label={t('Font style')}
              name={`${focusIdx}.attributes.font-style`}
              options={[
                { value: 'normal', label: t('Normal') },
                { value: 'italic', label: t('Italic') },
                { value: 'oblique', label: t('Oblique') },
              ]}
            />
            <SelectField
              label={t('Text align')}
              name={`${focusIdx}.attributes.text-align`}
              options={[
                { value: 'left', label: t('Left') },
                { value: 'center', label: t('Center') },
                { value: 'right', label: t('Right') },
              ]}
            />
          </Stack>
        </Collapse.Panel>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}
