import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Dropdown, Input, App, Modal, Popover, Row, Spin } from 'antd';
import { DeleteOutlined, EyeOutlined, MailOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import { Uploader, UploaderServer } from '@extensions/AttributePanel/utils/Uploader';
import { classnames } from '@extensions/AttributePanel/utils/classnames';
import { previewLoadImage } from '@extensions/AttributePanel/utils/previewLoadImage';
import { MergeTags } from '@extensions';
import { IconFont, useEditorProps } from 'easy-email-editor';

export interface ImageUploaderProps {
  onChange: (val: string) => void;
  value: string;
  label: string;
  uploadHandler?: UploaderServer;
  autoCompleteOptions?: Array<{ value: string; label: React.ReactNode; }>;
}

export function ImageUploader(props: ImageUploaderProps) {
  const { mergeTags } = useEditorProps();
  const { message } = App.useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(false);
  const uploadHandlerRef = useRef<UploaderServer | null | undefined>(
    props.uploadHandler,
  );

  const onChange = props.onChange;

  const onUpload = useCallback(() => {
    if (isUploading) {
      return message.warning(t('Uploading...'));
    }
    if (!uploadHandlerRef.current) return;

    const uploader = new Uploader(uploadHandlerRef.current, {
      limit: 1,
      accept: 'image/*',
    });

    uploader.on('start', () => {
      setIsUploading(true);

      uploader.on('end', (data) => {
        const url = data[0]?.url;
        if (url) {
          onChange(url);
        }
        setIsUploading(false);
      });
    });

    uploader.chooseFile();
  }, [isUploading, onChange, message]);

  const onPaste = useCallback(
    async (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (!uploadHandlerRef.current) return;
      const clipboardData = e.clipboardData;

      for (let i = 0; i < clipboardData.items.length; i++) {
        const item = clipboardData.items[i];
        if (item.kind == 'file') {
          const blob = item.getAsFile();

          if (!blob || blob.size === 0) {
            return;
          }
          try {
            setIsUploading(true);
            const picture = await uploadHandlerRef.current(blob);
            await previewLoadImage(picture);
            props.onChange(picture);
            setIsUploading(false);
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message :
                               (typeof error === 'string' ? error : t('Upload failed'));
            message.error(errorMessage);
            setIsUploading(false);
          }
        }
      }
    },
    [props, message],
  );

  const onRemove = useCallback(() => {
    props.onChange('');
  }, [props]);

  const content = useMemo(() => {
    if (isUploading) {
      return (
        <div className={styles['item']}>
          <div className={classnames(styles['info'])}>
            <Spin />
            <div className={styles['btn-wrap']} />
          </div>
        </div>
      );
    }

    if (!props.value) {
      return (
        <div className={styles['upload']} onClick={onUpload}>
          <PlusOutlined />
          <div>Upload</div>
        </div>
      );
    }

    return (
      <div className={styles['item']}>
        <div className={classnames(styles['info'])}>
          <img src={props.value} alt={t('Uploaded image')} />
          <div className={styles['btn-wrap']}>
            <a title={t('Preview')} onClick={() => setPreview(true)}>
              <EyeOutlined />
            </a>
            <a title={t('Remove')} onClick={() => onRemove()}>
              <DeleteOutlined />
            </a>
          </div>
        </div>
      </div>
    );
  }, [isUploading, onRemove, onUpload, props.value]);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  // ...existing code...

  if (!props.uploadHandler) {
    return <Input value={props.value} onChange={onInputChange} />;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles['container']}>
        {content}
        <Row style={{ width: '100%' }}>
          {mergeTags && (
            <Popover
              trigger="click"
              content={<MergeTags value={props.value} onChange={onChange} />}
            >
              <Button icon={<IconFont iconName="icon-merge-tags" />} />
            </Popover>
          )}
          <Input
            style={{ flex: 1 }}
            onPaste={onPaste}
            value={props.value}
            onChange={onInputChange}
            disabled={isUploading}
          />
          {props.autoCompleteOptions && (
            <Dropdown
              placement="bottomRight"
              menu={{
                items: props.autoCompleteOptions.map((item, index) => ({
                  key: index.toString(),
                  label: (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={item.value}
                        alt={`Option ${index + 1}`}
                        style={{ width: 20, height: 20 }}
                      />
                      &emsp;<span>{item.label}</span>
                    </div>
                  ),
                })),
                onClick: ({ key }) => {
                  if (!props.autoCompleteOptions) return;
                  onChange(props.autoCompleteOptions[+key]?.value);
                },
              }}
            >
              <Button icon={<MailOutlined />} />
            </Dropdown>
          )}
        </Row>
      </div>
      <Modal open={preview} footer={null} onCancel={() => setPreview(false)}>
        <img alt={t('Preview')} style={{ width: '100%' }} src={props.value} />
      </Modal>
    </div>
  );
}
