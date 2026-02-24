import React, { useCallback, useEffect, useState } from 'react';
import { Collapse, Space, Switch } from 'antd';
import { useBlock, useEditorProps, useFocusIdx } from 'easy-email-editor';
import { AdvancedBlock, isAdvancedBlock, OperatorSymbol, Operator, ICondition } from 'easy-email-core';
import { Iteration } from '../Iteration';
import { Condition } from '../Condition';

export interface CollapseWrapperProps {
  defaultActiveKey: string[];
  children: React.ReactNode;
}

export const CollapseWrapper: React.FC<CollapseWrapperProps> = props => {
  const { enabledLogic } = useEditorProps();
  const [activeKeys, setActiveKeys] = useState<string[]>(props.defaultActiveKey);

  const { focusBlock, change } = useBlock();
  const { focusIdx } = useFocusIdx();
  const value = focusBlock?.data.value;

  const isAdvancedBlockType = isAdvancedBlock(focusBlock?.type);

  const iterationEnabled =
    isAdvancedBlockType && Boolean(value?.iteration && value?.iteration?.enabled);

  const conditionEnabled =
    isAdvancedBlockType && Boolean(value?.condition && value?.condition?.enabled);

  const onIterationToggle = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        if (!value?.iteration) {
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
    [change, focusIdx, value?.iteration]
  );

  const onConditionToggle = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        if (!value?.condition) {
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
            ],
          } as ICondition);
        }
      }
      change(`${focusIdx}.data.value.condition.enabled`, enabled);
    },
    [change, focusIdx, value?.condition]
  );

  const onChange = useCallback((keys: string[]) => {
    setActiveKeys(keys);
  }, []);

  useEffect(() => {
    if (!isAdvancedBlockType) return;

    if (iterationEnabled) {
      setActiveKeys(keys => [...keys, 'Iteration']);
    } else {
      setActiveKeys(keys => keys.filter(k => k !== 'Iteration'));
    }
  }, [iterationEnabled, isAdvancedBlockType]);

  useEffect(() => {
    if (!isAdvancedBlockType) return;

    if (conditionEnabled) {
      setActiveKeys(keys => [...keys, 'Condition']);
    } else {
      setActiveKeys(keys => keys.filter(k => k !== 'Condition'));
    }
  }, [conditionEnabled, isAdvancedBlockType]);

  return (
    <Space
      size='middle'
      orientation='vertical'
      style={{ width: '100%' }}
    >
      <Collapse
        onChange={onChange}
        defaultActiveKey={activeKeys}
        items={[
          ...React.Children.toArray(props.children).map((child, index) => {
            if (React.isValidElement(child) && child.props && typeof child.props === 'object' && child.props !== null && 'header' in child.props) {
              const childProps = child.props as { header: string; children: React.ReactNode; };
              return {
                key: child.key as string || index.toString(),
                label: childProps.header,
                children: childProps.children
              };
            }
            return null;
          }).filter((item): item is { key: string; label: string; children: React.ReactNode; } => item !== null),
          ...(enabledLogic ? [
            {
              key: 'Iteration',
              label: t('Iteration'),
              extra: (
                <div style={{ marginRight: 10 }}>
                  <Switch checked={iterationEnabled} onChange={onIterationToggle} />
                </div>
              ),
              children: <Iteration />
            },
            {
              key: 'Condition',
              label: t('Condition'),
              extra: (
                <div style={{ marginRight: 10 }}>
                  <Switch checked={conditionEnabled} onChange={onConditionToggle} />
                </div>
              ),
              children: <Condition />
            }
          ] : [])
        ]}
      />
      <div />
      <div />
      <div />
    </Space>
  );
};
