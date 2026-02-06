import { Collapse, Row, Col, Space, Typography } from 'antd';
import { AdvancedType, BlockManager, IBlockData } from 'easy-email-core';
import { BlockAvatarWrapper, IconFont } from 'easy-email-editor';
import React, { useMemo, useState } from 'react';
import { CaretRightOutlined, CaretUpOutlined } from '@ant-design/icons';
import { getIconNameByBlockType } from '@extensions/utils/getIconNameByBlockType';
import styles from './index.module.scss';
import { useExtensionProps } from '@extensions/components/Providers/ExtensionProvider';

export function Blocks() {
  const { categories } = useExtensionProps();

  const defaultActiveKey = useMemo(
    () => [
      ...categories.filter((item) => item.active).map((item) => item.label),
    ],
    [categories]
  );
  return (
    <Collapse
      defaultActiveKey={defaultActiveKey}
      style={{ paddingBottom: 30, minHeight: '100%' }}
    >
      {categories.map((cat, index) => {
        if (cat.displayType === 'column') {
          return (
            <Collapse.Panel
              key={index}
              style={{ padding: '0px 20px' }}
              extra={cat.label}
              header={cat.label}
            >
              <Space orientation='vertical'>
                <div />
              </Space>
              {cat.blocks.map((item) => (
                <LayoutItem
                  key={item.title}
                  title={item.title || ''}
                  columns={item.payload}
                />
              ))}

              <Space orientation='vertical'>
                <div />
              </Space>
            </Collapse.Panel>
          );
        }

        if (cat.displayType === 'custom') {
          return (
            <Collapse.Panel
              key={index}
              style={{ padding: 0, paddingBottom: 0, paddingTop: 20 }}
              extra={cat.label}
              header={cat.label}
            >
              <Row>
                {cat.blocks.map((item, blockIndex) => {
                  // Check if item is a draggable custom block object
                  // React elements have $$typeof property, so we check for that
                  if (
                    typeof item === 'object' &&
                    item !== null &&
                    !React.isValidElement(item) &&
                    'type' in item &&
                    'children' in item
                  ) {
                    const customBlock = item as {
                      type: string;
                      payload?: any;
                      title?: string;
                      children: React.ReactNode;
                      canDragAndDrop?: boolean;
                    };
                    // canDragAndDrop defaults to true if not specified
                    const canDragAndDrop = customBlock.canDragAndDrop !== false;

                    const blockContent = (
                      <div className={styles.blockItemContainer}>
                        {customBlock.children}
                      </div>
                    );

                    return (
                      <div key={blockIndex} className={styles.blockItem}>
                        {canDragAndDrop ? (
                          <BlockAvatarWrapper
                            type={customBlock.type}
                            payload={customBlock.payload}
                          >
                            {blockContent}
                          </BlockAvatarWrapper>
                        ) : (
                          <div style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                            {blockContent}
                          </div>
                        )}
                      </div>
                    );
                  }
                  // Regular React node (component or element)
                  return <React.Fragment key={blockIndex}>{item}</React.Fragment>;
                })}
              </Row>
            </Collapse.Panel>
          );
        }
        return (
          <Collapse.Panel
            key={index}
            style={{ padding: 0, paddingBottom: 0, paddingTop: 20 }}
            extra={cat.label}
            header={cat.label}
          >
            <Row>
              {cat.blocks.map((item, index) => {
                return <BlockItem key={index} {...(item as any)} />;
              })}
            </Row>
          </Collapse.Panel>
        );
      })}
    </Collapse>
  );
}

function BlockItem({
  type,
  payload,
  title,
  filterType,
}: {
  type: string;
  payload?: Partial<IBlockData>;
  title?: string;
  filterType: string | undefined;
}) {
  const block = BlockManager.getBlockByType(type);

  return (
    <div className={styles.blockItem}>
      <BlockAvatarWrapper type={type} payload={payload}>
        <div className={styles.blockItemContainer}>
          <IconFont
            style={{ fontSize: 20 }}
            iconName={getIconNameByBlockType(type)}
          />
          <Typography.Text style={{ marginTop: 10 }}>
            {title || block?.name}
          </Typography.Text>
        </div>
      </BlockAvatarWrapper>
    </div>
  );
}

function LayoutItem({
  columns,
  title,
}: {
  columns: string[][];
  title: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <p
        onClick={() => setVisible((v) => !v)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <span>{title}</span>
        {columns.length > 1 && (
          <span>{!visible ? <CaretRightOutlined /> : <CaretUpOutlined />}</span>
        )}
      </p>
      {columns.map((item, index) => {
        const hide = !visible && index !== 0;
        const payload = {
          type: AdvancedType.SECTION,
          attributes: {},
          children: item.map((col) => ({
            type: AdvancedType.COLUMN,
            attributes: {
              width: col,
            },
            data: {
              value: {},
            },
            children: [],
          })),
        };

        return (
          <div
            key={index}
            style={{
              height: hide ? 0 : undefined,
              overflow: 'hidden',
              marginBottom: hide ? 0 : 20,
            }}
          >
            <BlockAvatarWrapper type={AdvancedType.SECTION} payload={payload}>
              <div
                style={{
                  border: '1px solid rgb(229, 229, 229)',
                  width: '100%',
                  padding: 10,
                }}
              >
                <div
                  style={{
                    height: 16,
                    border: '1px solid rgb(85, 85, 85)',
                    borderRadius: 3,
                    display: 'flex',
                  }}
                >
                  {item.map((column, index) => {
                    return (
                      <div
                        key={index}
                        style={{
                          borderRight:
                            index === item.length - 1
                              ? undefined
                              : '1px solid rgb(85, 85, 85)',
                          height: '100%',
                          width: column,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </BlockAvatarWrapper>
          </div>
        );
      })}
    </div>
  );
}
