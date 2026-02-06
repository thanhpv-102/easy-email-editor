import { classnames } from '@/utils/classnames';
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '../Button';
import { Stack } from '../Stack';
import './index.scss';

// Helper function to extract enum value from Babel-compiled string
function extractKeyValue(key: any): string {
  const keyStr = String(key || '');
  // Remove Babel enum prefix like ".$EDIT" -> "EDIT"
  if (keyStr.startsWith('.$')) {
    return keyStr.substring(2);
  }
  return keyStr;
}

export interface TabsProps {
  children?: React.ReactNode;
  tabBarExtraContent?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onChange?: (id: string) => void;
  onBeforeChange?: (current: string, next: string) => boolean;
  defaultActiveTab?: string;
  activeTab?: string;
}
export interface TabPaneProps {
  children?: React.ReactNode;
  tab: React.ReactNode;
  key: string;
  style?: React.CSSProperties;
  className?: string;
}

const Tabs: React.FC<TabsProps> = props => {
  // Initialize with prop value if provided, otherwise use defaultActiveTab
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    props.activeTab || props.defaultActiveTab || ''
  );

  // Always use props.activeTab if provided (controlled mode), otherwise use internal state (uncontrolled mode)
  const activeTab = props.activeTab !== undefined ? props.activeTab : internalActiveTab;


  const onClick = useCallback(
    (nextTab: string) => {
      // Always update internal state so uncontrolled mode works
      setInternalActiveTab(nextTab);

      if (!props.onBeforeChange) {
        props.onChange?.(nextTab);
      } else {
        const next = props.onBeforeChange(activeTab, nextTab);
        if (next) {
          props.onChange?.(nextTab);
        }
      }
    },
    [activeTab, props.onBeforeChange, props.onChange],
  );

  // Sync internal state when props.activeTab explicitly changes
  useEffect(() => {
    if (props.activeTab !== undefined) {
      setInternalActiveTab(props.activeTab);
    }
  }, [props.activeTab]);

  const childrenArray = React.Children.toArray(props.children) as React.ReactElement<TabPaneProps>[];

  return (
    <div
      style={props.style}
      className={props.className}
    >
      <div className='easy-email-editor-tabWrapper'>
        <Stack
          distribution='equalSpacing'
          alignment='center'
        >
          <Stack alignment='center'>
            {childrenArray.map((item, index) => {
                const itemKey = extractKeyValue(item.key) || String(index);
                const isActive = activeTab === itemKey;
                return (
                  <div
                    key={itemKey}
                    onClick={() => onClick(itemKey)}
                    className={classnames(
                      'easy-email-editor-tabItem',
                      isActive && 'easy-email-editor-tabActiveItem',
                    )}
                  >
                    <Button noBorder>
                      {/* @ts-ignore */}
                      {item.props.tab}
                    </Button>
                  </div>
                );
              })}
          </Stack>
          {props.tabBarExtraContent}
        </Stack>
      </div>
      {childrenArray.map((item, index) => {
          const itemKey = extractKeyValue(item.key) || String(index);
          const visible = itemKey === activeTab;
          return (
            <div
              key={itemKey}
              style={{
                display: visible ? undefined : 'none',
                height: 'calc(100% - 50px)',
              }}
            >
              {/* @ts-ignore */}
              {item}
            </div>
          );
        })}
    </div>
  );
};

const TabPane: React.FC<TabPaneProps> = props => {
  return <>{props.children}</>;
};

export { Tabs, TabPane };
