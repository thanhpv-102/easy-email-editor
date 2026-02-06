
import React, { useCallback, useMemo } from 'react';
import { InputWithUnit } from '../../../components/Form/InputWithUnit';
import { useFocusIdx, Stack, useBlock, TextStyle, IconFont, Field } from 'easy-email-editor';
import { Button, Row, Col, Space, Tooltip, Form } from 'antd';

export interface PaddingProps {
  title?: string;
  attributeName?: 'padding' | 'inner-padding' | 'text-padding';
  name?: string;
  showResetAll?: boolean;
}

// Helper component to handle individual padding fields without using enhancer
const PaddingFieldInput: React.FC<{
  label: string;
  paddingIndex: 0 | 1 | 2 | 3; // top, right, bottom, left
  paddingFieldName: string;
  inline?: boolean;
}> = ({ label, paddingIndex, paddingFieldName, inline }) => {
  const labelCol = inline
    ? { span: 7, style: { textAlign: 'right' as const, paddingRight: 0 } }
    : { span: 24, style: { paddingRight: 0 } };

  const wrapperCol = inline
    ? { span: 16, offset: 1 }
    : { span: 24 };

  return (
    <Field
      name={paddingFieldName}
    >
      {({ input: { value, onChange } }) => {
        const paddingParts = (value || '0px 0px 0px 0px').split(/\s+/);
        const currentValue = paddingParts[paddingIndex] || '0px';

        const handleChange = (newVal: string) => {
          const newParts = [...paddingParts];
          newParts[paddingIndex] = newVal;
          // Ensure we have exactly 4 parts
          while (newParts.length < 4) newParts.push('0px');
          onChange(newParts.slice(0, 4).join(' '));
        };

        return (
          <Form.Item
            label={label}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            style={{ margin: 0 }}
            labelAlign='left'
          >
            <InputWithUnit
              value={currentValue}
              onChange={handleChange}
            />
          </Form.Item>
        );
      }}
    </Field>
  );
};

export function Padding(props: PaddingProps = {}) {
  const { title = t('Padding'), attributeName = 'padding', name, showResetAll } = props;
  const { change } = useBlock();
  const { focusIdx } = useFocusIdx();

  const paddingFieldName = useMemo(() => {
    if (name) {
      return name;
    }
    return focusIdx + `.attributes[${attributeName}]`;
  }, [name, focusIdx, attributeName]);

  const onResetPadding = useCallback(() => {
    change(paddingFieldName, '0px 0px 0px 0px');
  }, [paddingFieldName, change]);

  return (
    <>
      <Stack
        vertical
        spacing='extraTight'
      >
        <Space align='center' size='small'>
          <TextStyle variation='strong'>{title}</TextStyle>
          {showResetAll && (
            <Tooltip title='Remove all padding'>
              <Button
                onClick={onResetPadding}
                size='small'
                icon={(
                  <IconFont
                    iconName='icon-remove'
                    size={12}
                  />
                )}
              />
            </Tooltip>
          )}
        </Space>

        <Row>
          <Col span={11}>
            <PaddingFieldInput
              label={t('Top (px)')}
              paddingIndex={0}
              paddingFieldName={paddingFieldName}
            />
          </Col>
          <Col offset={1} span={11}>
            <PaddingFieldInput
              label={t('Left (px)')}
              paddingIndex={3}
              paddingFieldName={paddingFieldName}
            />
          </Col>
        </Row>

        <Row>
          <Col span={11}>
            <PaddingFieldInput
              label={t('Bottom (px)')}
              paddingIndex={2}
              paddingFieldName={paddingFieldName}
            />
          </Col>
          <Col offset={1} span={11}>
            <PaddingFieldInput
              label={t('Right (px)')}
              paddingIndex={1}
              paddingFieldName={paddingFieldName}
            />
          </Col>
        </Row>
      </Stack>
    </>
  );
}

