import React, { useMemo } from 'react';
import { InputWithUnitField, TextField } from '../../../components/Form';
import { useFocusIdx } from 'easy-email-editor';
import { Col, Row } from 'antd';

export function Border() {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      <Row>
        <Col span={11}>
          <TextField
            label={'Border'}
            name={`${focusIdx}.attributes.border`}
            key={`${focusIdx}.attributes.border`}
          />
        </Col>
        <Col offset={1} span={11}>
          <InputWithUnitField
            label={'Border radius'}
            name={`${focusIdx}.attributes.border-radius`}
            key={`${focusIdx}.attributes.border-radius`}
            unitOptions="percent"
          />
        </Col>
      </Row>
    );
  }, [focusIdx]);
}
