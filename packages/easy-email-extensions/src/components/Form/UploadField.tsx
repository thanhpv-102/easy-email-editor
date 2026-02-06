import { Uploader } from '@extensions/AttributePanel/utils/Uploader';
import { Input } from 'antd';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';

export interface UploadFieldProps {
  onChange: (val: string) => void;
  value: string;
  inputDisabled?: boolean;
  accept?: string;
  uploadHandler: (file: File) => Promise<string>;
}

export function UploadField(props: UploadFieldProps) {
  const { onChange, inputDisabled = false, accept, uploadHandler } = props;
  const [loading, setLoading] = useState(false);
  const { current: uploader } = useRef(
    new Uploader(uploadHandler, {
      limit: 1,
      accept,
    }),
  );

  useEffect(() => {
    uploader.on('start', () => {
      setLoading(true);
      uploader.on('end', (photos) => {
        setLoading(false);
        onChange(
          photos
            .filter((item) => item.status === 'done')
            .map((item) => item.url)[0] || '',
        );
      });
    });
  }, [onChange, uploader]);

  const onClick = () => {
    if (loading) return;
    uploader.chooseFile();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Input
      prefix={loading ? <LoadingOutlined /> : <UploadOutlined onClick={onClick} style={{ cursor: 'pointer' }} />}
      value={props.value}
      onChange={inputDisabled ? undefined : handleChange}
    />
  );
}
