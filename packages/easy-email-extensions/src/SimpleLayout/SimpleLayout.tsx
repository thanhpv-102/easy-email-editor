import { ShortcutToolbar } from '../ShortcutToolbar';
import { Button, Card, ConfigProvider, Layout, Tabs, App } from 'antd';
import { useEditorProps } from 'easy-email-editor';
import React, { useState } from 'react';
import { SourceCodePanel } from '../SourceCodePanel';
import { AttributePanel } from '../AttributePanel';
import { BlockLayer, BlockLayerProps } from '../BlockLayer';
import { InteractivePrompt } from '../InteractivePrompt';
import styles from './index.module.scss';
import enUS from 'antd/locale/en_US';
import { MergeTagBadgePrompt } from '@extensions/MergeTagBadgePrompt';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export const SimpleLayout: React.FC<
  {
    showSourceCode?: boolean;
    jsonReadOnly?: boolean;
    mjmlReadOnly?: boolean;
    defaultShowLayer?: boolean;
    children: React.ReactNode | React.ReactElement;
  } & BlockLayerProps
> = props => {
  const { height: containerHeight } = useEditorProps();
  const { showSourceCode = true, defaultShowLayer = true, jsonReadOnly = true, mjmlReadOnly = true } = props;
  const [collapsed, setCollapsed] = useState(!defaultShowLayer);
  return (
    <ConfigProvider locale={enUS}>
      <App>
        <Layout
          className={styles.SimpleLayout}
          style={{
            display: 'flex',
            width: '100%',
            overflow: 'hidden',
            minWidth: 1400,
          }}
        >
          <Layout.Sider
            style={{ paddingRight: 0 }}
            collapsed={collapsed}
            collapsible
            trigger={null}
            breakpoint="xl"
            collapsedWidth={60}
            width={350}
          >
            <Card
              styles={{ body: { padding: 0 } }}
              style={{ border: 'none' }}
            >
              <Card.Grid style={{ width: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '12px 0' }}>
                <ShortcutToolbar />
                <Button
                  style={{
                    marginTop: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
                  shape="round"
                  onClick={() => setCollapsed(v => !v)}
                />
              </Card.Grid>
              <Card.Grid
                className={styles.customScrollBar}
                style={{
                  flex: 1,
                  padding: '0 5px',
                  border: 'none',
                  height: containerHeight,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  width: '100%',
                }}
              >
                <Card
                  title={'Layout'}
                  style={{ border: 'none', width: '100%' }}
                  styles={{ header: { height: 50 }, body: { width: '100%', padding: '0 5px' } }}
                >
                  {!collapsed && <BlockLayer renderTitle={props.renderTitle} />}
                </Card>
              </Card.Grid>
            </Card>
          </Layout.Sider>

          <Layout style={{ height: containerHeight }}>{props.children}</Layout>

          <Layout.Sider
            style={{
              height: containerHeight,
              width: 350,
            }}
            className={styles.rightSide}
          >
            <Card
              size="small"
              id="rightSide"
              style={{
                maxHeight: '100%',
                height: '100%',
                borderLeft: 'none',
                borderRadius: 0,
              }}
              styles={{ body: { padding: 0 } }}
              className={styles.customScrollBarV2}
            >
              <Tabs
                className={styles.layoutTabs}
                items={[
                  {
                    key: 'configuration',
                    label: (
                      <div style={{ height: 28, lineHeight: '28px', marginLeft: 12, paddingRight: 12, fontSize: 12 }}>
                        {'Configuration'}
                      </div>
                    ),
                    children: <AttributePanel />,
                  },
                  ...(showSourceCode ? [{
                    key: 'source-code',
                    label: (
                      <div style={{ height: 28, lineHeight: '28px', fontSize: 12 }}>
                        {'Source code'}
                      </div>
                    ),
                    children: <SourceCodePanel jsonReadOnly={jsonReadOnly} mjmlReadOnly={mjmlReadOnly} />,
                    destroyOnHidden: true,
                  }] : [])
                ]}
              />
            </Card>
          </Layout.Sider>

          <InteractivePrompt />
          <MergeTagBadgePrompt />
        </Layout>
      </App>
    </ConfigProvider>
  );
};
