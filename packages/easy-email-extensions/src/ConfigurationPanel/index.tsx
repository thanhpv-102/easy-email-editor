import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { AttributePanel } from '@extensions/AttributePanel';
import { SourceCodePanel } from '@extensions/SourceCodePanel';
import { FullHeightOverlayScrollbars } from '@extensions/components/FullHeightOverlayScrollbars';
import styles from './index.module.scss';

export interface ConfigurationPanelProps {
  showSourceCode: boolean;
  jsonReadOnly: boolean;
  mjmlReadOnly: boolean;
  height: string;
  onBack?: () => void;
  compact?: boolean;
}

export function ConfigurationPanel({
                                     showSourceCode,
                                     height,
                                     onBack,
                                     compact,
                                     jsonReadOnly,
                                     mjmlReadOnly,
                                   }: ConfigurationPanelProps) {
  const [inited, setInited] = useState(false);

  useEffect(() => {
    // Tabs 在 drawer 里面有bug
    let timer = setTimeout(() => {
      setInited(true);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!inited) return null;

  return (
    <>
      {showSourceCode ? (
        <Tabs
          className={styles.tabs}
          renderTabBar={(props, DefaultTabBar) =>
            !compact ? (
              <div
                className={styles.largeTabsHeader}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <div
                  style={{ padding: 10, cursor: 'pointer' }}
                  onClick={onBack}
                >
                  <LeftOutlined style={{ fontSize: 16 }} />
                </div>
                <DefaultTabBar {...props} style={{ flex: 1 }} />
              </div>
            ) : (
              <div
                className={styles.largeTabsHeader}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <DefaultTabBar {...props} style={{ flex: 1 }} />
              </div>
            )
          }
          items={[
            {
              key: 'configuration',
              label: (
                <div style={{ height: 40, lineHeight: '40px' }}>{'Configuration'}</div>
              ),
              children: (
                <FullHeightOverlayScrollbars height={`calc(${height} - 60px)`}>
                  <AttributePanel />
                </FullHeightOverlayScrollbars>
              ),
            },
            {
              key: 'source-code',
              label: (
                <div style={{ height: 40, lineHeight: '40px' }}>{'Source code'}</div>
              ),
              children: (
                <FullHeightOverlayScrollbars height={`calc(${height} - 60px)`}>
                  <SourceCodePanel jsonReadOnly={jsonReadOnly} mjmlReadOnly={mjmlReadOnly} />
                </FullHeightOverlayScrollbars>
              ),
              destroyOnHidden: true,
            },
          ]}
        />
      ) : (
        <AttributePanel />
      )}
    </>
  );
}
