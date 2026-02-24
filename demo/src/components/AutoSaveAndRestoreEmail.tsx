import React, { useEffect, useState } from 'react';
import { useForm, useFormState, IEmailTemplate } from 'easy-email-editor';
import { useInterval, useLocalStorage } from 'react-use';
import { WarnAboutUnsavedChanges } from './WarnAboutUnsavedChanges';
import { Modal } from 'antd';
import { useQuery } from '@demo/hooks/useQuery';

export function AutoSaveAndRestoreEmail() {
  const formState = useFormState<any>();
  const { reset } = useForm();
  const { id = 'new' } = useQuery<{ id: string }>();

  const [currentEmail, setCurrentEmail] =
    useLocalStorage<IEmailTemplate | null>(id, null);
  const dirty = formState.dirty;

  const [visible, setVisible] = useState(Boolean(currentEmail));

  useEffect(() => {
    if (dirty) {
      setCurrentEmail(formState.values);
    }
  }, [dirty, formState.values, setCurrentEmail]);

  useInterval(() => {
    if (dirty) {
      setCurrentEmail(formState.values);
    }
  }, 5000);

  const onRestore = () => {
    if (currentEmail) {
      reset(currentEmail);
      setCurrentEmail(null);
      setVisible(false);
    }
  };

  const onDiscard = () => {
    setCurrentEmail(null);
    setVisible(false);
  };

  const onBeforeConfirm = () => {
    setCurrentEmail(null);
  };

  return (
    <>
      <Modal
        title='Restore email?'
        open={Boolean(visible && currentEmail)}
        onOk={onRestore}
        okText='Restore'
        cancelText='Discard'
        onCancel={onDiscard}
        style={{ zIndex: 10000 }}
      >
        <p>Are you want to restore unsaved email?</p>
      </Modal>
      <WarnAboutUnsavedChanges onBeforeConfirm={onBeforeConfirm} />
    </>
  );
}
