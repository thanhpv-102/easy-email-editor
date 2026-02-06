import { Collapse, Input, App } from 'antd';
import { BasicType, BlockManager, getPageIdx, getParentByIdx, IBlockData, JsonToMjml } from 'easy-email-core';
import { useBlock, useEditorContext, useEditorProps, useFocusIdx } from 'easy-email-editor';
import { cloneDeep } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MjmlToJson } from '@extensions/utils/MjmlToJson';
import styles from './index.module.scss';

export function SourceCodePanel({ jsonReadOnly, mjmlReadOnly }: { jsonReadOnly: boolean; mjmlReadOnly: boolean }) {
  const { setValueByIdx, focusBlock, values } = useBlock();
  const { focusIdx } = useFocusIdx();
  const { message } = App.useApp();

  const [mjmlText, setMjmlText] = useState('');
  const { pageData } = useEditorContext();
  const { mergeTags } = useEditorProps();

  const code = useMemo(() => {
    if (!focusBlock) return '';
    return JSON.stringify(focusBlock, null, 2) || '';
  }, [focusBlock]);

  const onChangeCode = useCallback(
    (event: React.FocusEvent<HTMLTextAreaElement>) => {
      if (!jsonReadOnly) {
        try {
          const parseValue = JSON.parse(
            JSON.stringify(eval('(' + event.target.value + ')')),
          ) as IBlockData;

          const block = BlockManager.getBlockByType(parseValue.type);
          if (!block) {
            throw new Error(t('Invalid content'));
          }
          if (
            !parseValue.data ||
            !parseValue.data.value ||
            !parseValue.attributes ||
            !Array.isArray(parseValue.children)
          ) {
            throw new Error(t('Invalid content'));
          }
          setValueByIdx(focusIdx, parseValue);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          message.error(errorMessage);
        }
      }
    },
    [focusIdx, setValueByIdx, jsonReadOnly, message],
  );

  const onMjmlChange = useCallback(
    (event: React.FocusEvent<HTMLTextAreaElement>) => {
      if (!mjmlReadOnly) {
        try {
          const parseValue = MjmlToJson(event.target.value);
          if (parseValue.type !== BasicType.PAGE as string) {
            const parentBlock = values && getParentByIdx(values, focusIdx)!;
            const parseBlock = BlockManager.getBlockByType(parseValue.type);

            if (!parseBlock?.validParentType.includes(parentBlock?.type || '')) {
              throw new Error(t('Invalid content'));
            }
          } else if (focusIdx !== getPageIdx()) {
            throw new Error(t('Invalid content'));
          }

          setValueByIdx(focusIdx, parseValue);
        } catch {
          message.error(t('Invalid content'));
        }
      }
    },
    [focusIdx, setValueByIdx, values, mjmlReadOnly, message],
  );

  const onChangeMjmlText = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMjmlText(event.target.value);
  }, []);

  useEffect(() => {
    if (focusBlock) {
      setMjmlText(
        JsonToMjml({
          idx: focusIdx,
          data: focusBlock,
          context: pageData,
          mode: 'production',
          dataSource: cloneDeep(mergeTags),
        }),
      );
    }
  }, [focusBlock, focusIdx, pageData, mergeTags]);

  if (!focusBlock) return null;

  return (
    <Collapse className={styles.collapsePanel}>
      <Collapse.Panel
        key="json"
        header={t('Json source')}
      >
        <Input.TextArea
          key={code}
          defaultValue={code}
          autoSize={{ maxRows: 25 }}
          onBlur={onChangeCode}
          readOnly={jsonReadOnly}
          className={styles.customTextArea}
        />
      </Collapse.Panel>
      <Collapse.Panel
        key="mjml"
        header={t('MJML source')}
      >
        <Input.TextArea
          key={code}
          value={mjmlText}
          autoSize={{ maxRows: 25 }}
          onChange={onChangeMjmlText}
          onBlur={onMjmlChange}
          readOnly={mjmlReadOnly}
          className={styles.customTextArea}
        />
      </Collapse.Panel>
    </Collapse>
  );
}
