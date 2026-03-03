import { Col, Row, Space } from 'antd';
import type { TooltipProps } from 'antd';
import React, { useCallback, useMemo, useRef } from 'react';
import { Form, IconFont, Stack, TextStyle } from 'easy-email-editor';
import { SearchField, SwitchField } from '@extensions/components/Form';
import { ToolItem } from '../ToolItem';
import { EMAIL_BLOCK_CLASS_NAME } from 'easy-email-core';
import { useRichTextPopupOpen } from '../../hooks/useRichTextPopupOpen';
import { RichTextPortalPopup } from '../RichTextPortalPopup';

export interface LinkParams {
  link: string;
  blank: boolean;
  underline: boolean;
  linkNode: HTMLAnchorElement | null;
}

export interface LinkProps extends Omit<TooltipProps, 'title'> {
  currentRange: Range | null | undefined;
  onChange: (val: LinkParams) => void;
}

function getAnchorElement(
  node: Node | null,
): HTMLAnchorElement | null {
  if (!node) return null;
  if (node instanceof HTMLAnchorElement) {
    return node;
  }
  if (node instanceof Element && node.classList.contains(EMAIL_BLOCK_CLASS_NAME)) return null;

  return getAnchorElement(node.parentNode);
}

export function getLinkNode(
  currentRange: Range | null | undefined,
): HTMLAnchorElement | null {
  let linkNode: HTMLAnchorElement | null = null;
  if (!currentRange) return null;
  linkNode = getAnchorElement(currentRange.startContainer);
  return linkNode;
}

export function Link(props: LinkProps) {
  const { open, rect, close, handleTriggerClick, setTriggerRef, setPopupContainerRef } = useRichTextPopupOpen();

  // Compute live values from current selection
  const liveValues = useMemo((): LinkParams => {
    let link = '';
    let blank = true;
    let underline = true;
    let linkNode: HTMLAnchorElement | null = getLinkNode(props.currentRange);
    if (linkNode) {
      link = linkNode.getAttribute('href') || '';
      blank = linkNode.getAttribute('target') === '_blank';
      underline = linkNode.style.textDecoration === 'underline';
    }
    return { link, blank, underline, linkNode };
  }, [props.currentRange]);

  // Freeze initial values when popup opens — don't let selection changes remount the Form
  const frozenValuesRef = useRef<LinkParams>(liveValues);
  if (!open) {
    // Only update frozen values when popup is closed (i.e. on next open)
    frozenValuesRef.current = liveValues;
  }
  const initialValues = frozenValuesRef.current;

  const onSubmit = useCallback(
    (values: LinkParams) => {
      props.onChange(values);
      close();
    },
    [props, close],
  );

  return (
    <>
      <span ref={setTriggerRef}>
        <ToolItem
          isActive={Boolean(initialValues.link)}
          title={t('Link')}
          icon={<IconFont iconName="icon-link" />}
          onClick={handleTriggerClick}
        />
      </span>
      <RichTextPortalPopup
        open={open}
        rect={rect}
        containerRef={setPopupContainerRef}
        placement="bottom"
      >
        <Form
          key={initialValues.link}
          initialValues={initialValues}
          onSubmit={onSubmit}
        >
          {({ handleSubmit }) => (
            <div style={{
              color: 'var(--ant-color-text)',
              backgroundColor: 'var(--ant-color-bg-container)',
              padding: '8px 12px',
              minWidth: 260
            }}>
              <Stack vertical spacing="none">
                <SearchField
                  size="small"
                  name="link"
                  key="link"
                  label={t('Link')}
                  labelHidden
                  placeholder={t('https://www.example.com')}
                  onSearch={() => handleSubmit()}
                />
              </Stack>
              <Row>
                <Col span={12}>
                  <Space align="center" size="small">
                    <TextStyle size="smallest">{t('Target')}</TextStyle>
                    <SwitchField size="small" label={t('Target')} labelHidden name="blank" key="blank" inline />
                  </Space>
                </Col>
                <Col span={12}>
                  <Space align="center" size="small">
                    <TextStyle size="smallest">{t('Underline')}</TextStyle>
                    <SwitchField size="small" label={t('Underline')} labelHidden name="underline" key="underline" inline />
                  </Space>
                </Col>
              </Row>
            </div>
          )}
        </Form>
      </RichTextPortalPopup>
    </>
  );
}
