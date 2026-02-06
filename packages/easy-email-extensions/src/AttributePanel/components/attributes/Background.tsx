import React, { useMemo } from 'react';
import { ImageUploaderField, SelectField, TextField } from '../../../components/Form';
import { useFocusIdx, useEditorProps } from 'easy-email-editor';
import { BackgroundColor } from './BackgroundColor';
import { Row, Col, Space } from 'antd';

const backgroundRepeatOptions = [
  {
    value: 'no-repeat',
    get label() {
      return 'No repeat';
    },
  },
  {
    value: 'repeat',
    get label() {
      return 'Repeat';
    },
  },
  {
    value: 'repeat-x',
    get label() {
      return 'Repeat X';
    },
  },
  {
    value: 'repeat-y',
    get label() {
      return 'Repeat Y';
    },
  },
];

export function Background() {
  const { focusIdx } = useFocusIdx();
  const { onUploadImage } = useEditorProps();
  return useMemo(() => {
    return (
      <Space
        orientation='vertical'
        size='small'
      >
        <ImageUploaderField
          label={'Background image'}
          name={`${focusIdx}.attributes.background-url`}
          key={`${focusIdx}.attributes.background-url`}
          helpText={
            'The image suffix should be .jpg, jpeg, png, gif, etc. Otherwise, the picture may not be displayed normally.'
          }
          uploadHandler={onUploadImage}
        />

        <Row>
          <Col span={11}>
            <BackgroundColor />
          </Col>
          <Col
            offset={1}
            span={11}
          >
            <SelectField
              label={'Background repeat'}
              key={`${focusIdx}.attributes.background-repeat`}
              options={backgroundRepeatOptions}
              name={`${focusIdx}.attributes.background-repeat`}
            />
          </Col>
        </Row>
        <TextField
          label={'Background size'}
          name={`${focusIdx}.attributes.background-size`}
          key={`${focusIdx}.attributes.background-size`}
        />
      </Space>
    );
  }, [focusIdx, onUploadImage]);
}
