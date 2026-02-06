import React, { useMemo } from 'react';
import { useFocusIdx, IconFont } from 'easy-email-editor';
import { LinkOutlined } from '@ant-design/icons';
import { SelectField, TextField } from '../../../components/Form';
import { Row, Col, Popover, Space, Button } from 'antd';
import { MergeTags } from './MergeTags';
import { useField } from 'easy-email-editor';

export function Link() {
  const { focusIdx } = useFocusIdx();
  const { input } = useField(`${focusIdx}.attributes.href`, {
    parse: (v: string) => v,
  });

  return useMemo(() => {
    return (
      <Row>
        <Col span={11}>
          <TextField
            prefix={<LinkOutlined />}
            label={
              (
                <Space>
                  <span>{'Href'}&nbsp;&nbsp;&nbsp;</span>
                  <Popover
                    trigger='click'
                    content={
                      <MergeTags value={input.value || ''} onChange={input.onChange} />
                    }
                  >
                    <Button
                      type='text'
                      icon={<IconFont iconName='icon-merge-tags' />}
                    />
                  </Popover>
                </Space>
              )
            }
            name={`${focusIdx}.attributes.href`}
          />
        </Col>
        <Col
          offset={1}
          span={11}
        >
          <SelectField
            label={'Target'}
            name={`${focusIdx}.attributes.target`}
            options={[
              {
                value: '',
                label: '_self',
              },
              {
                value: '_blank',
                label: '_blank',
              },
            ]}
          />
        </Col>
      </Row>
    );
  }, [focusIdx, input.value, input.onChange]);
}
