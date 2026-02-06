import { FieldArray, Stack, TextStyle, useBlock, useFocusIdx } from 'easy-email-editor';
import React from 'react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { TextField } from '.';
import { Button } from 'antd';
import { Help } from '@extensions/AttributePanel/components/UI/Help';
import { IPage } from 'easy-email-core';

export function AddFont() {
  const { focusBlock } = useBlock();
  const { focusIdx } = useFocusIdx();
  const value: IPage['data']['value'] = focusBlock?.data.value;
  return (
    <FieldArray name={`${focusIdx}.data.value.fonts`}>
      {({ fields }) => {
        return (
          <div>
            <Stack
              vertical
              spacing="tight"
            >
              <Stack distribution="equalSpacing">
                <TextStyle variation="strong">
                  {t('Import font')} <Help title={t('Points to a hosted css file')} />
                </TextStyle>
                <Stack>
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => fields.push({ name: '', href: '' })}
                  />
                </Stack>
              </Stack>

              <Stack
                vertical
                spacing="extraTight"
              >
                {value.fonts?.map((item, index) => {
                  return (
                    <div key={index}>
                      <Stack
                        alignment="center"
                        wrap={false}
                      >
                        <Stack.Item fill>
                          <TextField
                            name={`${focusIdx}.data.value.fonts.${index}.name`}
                            label={t('Name')}
                          />
                        </Stack.Item>
                        <Stack.Item fill>
                          <TextField
                            name={`${focusIdx}.data.value.fonts.${index}.href`}
                            label={t('Href')}
                          />
                        </Stack.Item>
                        <Stack
                          vertical
                          spacing="loose"
                        >
                          <Stack.Item />
                          <Button
                            icon={<DeleteOutlined />}
                            onClick={() => fields.remove(index)}
                          />
                        </Stack>
                      </Stack>
                    </div>
                  );
                })}
              </Stack>
            </Stack>
          </div>
        );
      }}
    </FieldArray>
  );
}
