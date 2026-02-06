import { Layout, Tabs } from 'antd';
import { useEditorProps } from 'easy-email-editor';
import React from 'react';
import { Blocks } from './Blocks';
import { BlockLayer } from '@extensions/BlockLayer';
import { FullHeightOverlayScrollbars } from '@extensions/components/FullHeightOverlayScrollbars';
import styles from './index.module.scss';
import { ConfigurationDrawer } from './ConfigurationDrawer';
import { useExtensionProps } from '@extensions/components/Providers/ExtensionProvider';

export function EditPanel({
                            showSourceCode,
                            jsonReadOnly,
                            mjmlReadOnly,
                          }: {
  showSourceCode: boolean;
  jsonReadOnly: boolean;
  mjmlReadOnly: boolean;
}) {
  const { height } = useEditorProps();
  const { compact = true, showBlockLayer = true } = useExtensionProps();

  return (
    <Layout.Sider
      className={styles.blocksPanel}
      style={{ paddingRight: 0, minWidth: 360 }}
      // collapsed={collapsed}
      collapsible
      trigger={null}
      breakpoint="xl"
      collapsedWidth={60}
      width={360}
    >
      <Tabs
        defaultActiveKey='2'
        style={{ width: '100%', padding: 0 }}
        renderTabBar={(props, DefaultTabBar) => (
          <div className={styles.largeTabsHeader}>
            <DefaultTabBar {...props} />
          </div>
        )}
        items={[
          {
            key: '2',
            label: 'Block',
            children: (
              <FullHeightOverlayScrollbars height={`calc(${height} - 60px)`}>
                <Blocks />
              </FullHeightOverlayScrollbars>
            )
          },
          ...(showBlockLayer ? [{
            key: '1',
            label: 'Layer',
            children: (
              <FullHeightOverlayScrollbars height={`calc(${height} - 60px)`}>
                <div style={{ padding: 20 }}>
                  <BlockLayer />
                </div>
              </FullHeightOverlayScrollbars>
            )
          }] : [])
        ]}
      />
      {!compact && (
        <ConfigurationDrawer
          height={height}
          showSourceCode={showSourceCode}
          compact={Boolean(compact)}
          jsonReadOnly={jsonReadOnly}
          mjmlReadOnly={mjmlReadOnly}
        />
      )}
    </Layout.Sider>
  );
}
