import { useBlock, useFocusIdx } from 'easy-email-editor';
import { Collapse, Row, Col, Switch } from 'antd';
import { AdvancedBlock, AdvancedType } from 'easy-email-core';
import { TextField } from '@extensions/components/Form';
import React, { useCallback } from 'react';

export function Iteration() {
  const { focusIdx } = useFocusIdx();
  const { focusBlock, change } = useBlock();
  const iteration = focusBlock?.data.value?.iteration as
    | undefined
    | AdvancedBlock['data']['value']['iteration'];

  const onIterationToggle = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        if (!iteration) {
          change(`${focusIdx}.data.value.iteration`, {
            enabled: true,
            dataSource: '',
            itemName: 'item',
            limit: 9999,
            mockQuantity: 1,
          } as AdvancedBlock['data']['value']['iteration']);
        }
      }
      change(`${focusIdx}.data.value.iteration.enabled`, enabled);
    },
    [change, focusIdx, iteration]
  );

  if (
    !focusBlock?.type ||
    !Object.values(AdvancedType).includes(focusBlock.type as AdvancedType)
  ) {
    return null;
  }

  return (
    <Collapse.Panel
      className='iteration'
      key='Iteration'
      header={'Iteration'}
      extra={(
        <div style={{ marginRight: 10 }}>
          <Switch checked={iteration?.enabled} onChange={onIterationToggle} />
        </div>
      )}
    >
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
    </Collapse.Panel>
  );
}
