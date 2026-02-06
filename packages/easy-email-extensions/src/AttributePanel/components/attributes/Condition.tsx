import { useBlock, useFocusIdx } from 'easy-email-editor';
import { AdvancedBlock, OperatorSymbol, AdvancedType, Operator, ICondition, IConditionGroup } from 'easy-email-core';
import { Collapse, Row, Col, Switch, Button, Space, List, App } from 'antd';
import { SelectField, TextField } from '@extensions/components/Form';
import React, { useCallback } from 'react';
import { cloneDeep, get, upperFirst } from 'lodash';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useField } from 'easy-email-editor';

export function Condition() {
  const { focusIdx } = useFocusIdx();
  const { focusBlock, change, values } = useBlock();
  const { message } = App.useApp();
  const condition = focusBlock?.data.value?.condition as
    | undefined
    | AdvancedBlock['data']['value']['condition'];

  const onConditionToggle = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        if (!condition) {
          change(`${focusIdx}.data.value.condition`, {
            enabled: true,
            symbol: OperatorSymbol.AND,
            groups: [
              {
                symbol: OperatorSymbol.AND,
                groups: [
                  {
                    left: '',
                    operator: Operator.TRUTHY,
                    right: ''
                  }
                ],
              }
            ] as unknown[],
          } as ICondition);
        }
      }
      change(`${focusIdx}.data.value.condition.enabled`, enabled);
    },
    [change, condition, focusIdx]
  );

  const onAddCondition = useCallback((path: string) => {
    const groups = get(values, path) as IConditionGroup[];

    groups.push({
      symbol: OperatorSymbol.AND,
      groups: [
        {
          left: '',
          operator: Operator.TRUTHY,
          right: ''
        }
      ],
    });
    change(path, [...groups]);
  }, [change, values]);

  const onAddSubCondition = useCallback((path: string) => {
    const groups = get(values, path) as IConditionGroup['groups'];

    groups.push({
      left: '',
      operator: Operator.TRUTHY,
      right: ''

    });
    change(path, [...groups]);
  }, [change, values]);

  // content.children.[0].children.[0].data.value.condition.groups.1.groups
  const onDelete = useCallback((path: string, gIndex: number, ggIndex: number) => {
    if (!condition) return;
    const subPath = `${path}.${gIndex}.groups`;
    const groups = cloneDeep(get(values, path)) as IConditionGroup[];
    const subGroups = cloneDeep(get(values, subPath)) as IConditionGroup['groups'];

    subGroups.splice(ggIndex, 1);
    if (subGroups.length === 0) {
      if (groups.length === 1) {
        message.warning('At least one condition');
        return;
      }
      // remove empty array
      groups.splice(gIndex, 1);
      change(path, [...groups]);
    } else {
      change(subPath, [...subGroups]);
    }

  }, [change, condition, values, message]);

  if (
    !focusBlock?.type ||
    !Object.values(AdvancedType).includes(focusBlock.type as AdvancedType)
  ) {
    return null;
  }

  return (
    <Collapse.Panel
      style={{
        paddingLeft: 10
      }}
      className='condition'
      key='Condition'
      header={t('Condition')}
      extra={(
        <div style={{ marginRight: 10 }}>
          <Switch checked={condition?.enabled} onChange={onConditionToggle} />
        </div>
      )}
    >

      {condition?.enabled && (
        <Space orientation='vertical' size='middle'>

          <List
            header={(
              <Row justify='space-between'>
                <Col span={16}>
                  {condition.groups.length > 1 && (
                    <SelectField inline name={`${focusIdx}.data.value.condition.symbol`}
                      label={t('Symbol')}
                      options={[
                        {
                          label: t('And'),
                          value: OperatorSymbol.AND
                        },
                        {
                          label: t('Or'),
                          value: OperatorSymbol.OR
                        },
                      ]}
                    />
                  )}
                </Col>
                <Button onClick={() => onAddCondition(`${focusIdx}.data.value.condition.groups`)} size='small' icon={<PlusOutlined />} />
              </Row>
            )}
            dataSource={condition.groups}
            renderItem={
              (group: IConditionGroup, gIndex: number) => {
                return (
                  <List.Item key={gIndex}>
                    <div>
                      <Row justify='space-between'>
                        <Col span={16}>
                          {
                            group.groups.length > 1 && (
                              <SelectField inline name={`${focusIdx}.data.value.condition.groups.${gIndex}.symbol`}
                                label={t('Symbol')}
                                options={[
                                  {
                                    label: t('And'),
                                    value: OperatorSymbol.AND
                                  },
                                  {
                                    label: t('Or'),
                                    value: OperatorSymbol.OR
                                  },
                                ]}
                              />
                            )
                          }
                        </Col>
                        <Button size='small' icon={<PlusOutlined />} onClick={() => onAddSubCondition(`${focusIdx}.data.value.condition.groups.${gIndex}.groups`)} />
                      </Row>
                      {
                        group.groups.map((_item: IConditionGroup['groups'][number], ggIndex: number) => (
                          <div key={`condition-item-${gIndex}-${ggIndex}`}>
                            <ConditionItem
                              onDelete={onDelete}
                              path={`${focusIdx}.data.value.condition.groups`}
                              gIndex={gIndex}
                              ggIndex={ggIndex}
                            />
                          </div>
                        ))
                      }

                    </div>
                  </List.Item>
                );
              }
            }
          />

        </Space>
      )}
    </Collapse.Panel>
  );
}

const options = Object.values(Operator).map(item => ({ label: upperFirst(item), value: item }));

function ConditionItem({ path, onDelete, gIndex, ggIndex }: { path: string; gIndex: number; ggIndex: number; onDelete: (path: string, gIndex: number, ggIndex: number,) => void; }) {

  const name = `${path}.${gIndex}.groups.${ggIndex}`;
  const { input: { value } } = useField(name);

  const hideRight = (value as { operator?: Operator; })?.operator === Operator.TRUTHY || (value as { operator?: Operator; })?.operator === Operator.FALSY;

  return (
    <Row align='middle'>
      <Col span={7}> <TextField label={t('Variable path')} name={`${name}.left`} /></Col>
      <Col span={7}> <SelectField label={t('Operator')} name={`${name}.operator`} options={options} /></Col>
      <Col span={7}> {!hideRight && <TextField label="Right" name={`${name}.right`} />}</Col>
      <Col span={3}>
        <Button onClick={() => onDelete(path, gIndex, ggIndex)} icon={<DeleteOutlined />} />
      </Col>

    </Row>
  );
}