import { useBlock, useFocusIdx } from 'easy-email-editor';
import { Row, Col } from 'antd';
import { AdvancedBlock, AdvancedType } from 'easy-email-core';
import { TextField } from '@extensions/components/Form';
import React from 'react';

export function Iteration() {
  const { focusIdx } = useFocusIdx();
  const { focusBlock } = useBlock();
  const iteration = focusBlock?.data.value?.iteration as
    | undefined
    | AdvancedBlock['data']['value']['iteration'];

  if (
    !focusBlock?.type ||
    !Object.values(AdvancedType).includes(focusBlock.type as AdvancedType)
  ) {
    return null;
  }

  return (
    <>
      {iteration?.enabled && (
        <Col span={24}>
          <div>
            <Row>
              <Col span={11}>
                <TextField
                  label={'Data source'}
                  name={`${focusIdx}.data.value.iteration.dataSource`}
                />
              </Col>
              <Col offset={1} span={11}>
                <TextField
                  label={'Item name'}
                  name={`${focusIdx}.data.value.iteration.itemName`}
                />
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <TextField
                  label={'Limit'}
                  name={`${focusIdx}.data.value.iteration.limit`}
                  quickchange
                  type='number'
                  onChangeAdapter={(v) => Number(v)}
                />
              </Col>
              <Col offset={1} span={11}>
                <TextField
                  label={'Mock quantity'}
                  max={iteration?.limit}
                  name={`${focusIdx}.data.value.iteration.mockQuantity`}
                  type='number'
                  onChangeAdapter={(v) => Number(v)}
                  quickchange
                />
              </Col>
            </Row>
          </div>
        </Col>
      )}
    </>
  );
}
