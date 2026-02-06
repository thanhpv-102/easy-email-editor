import { useContext } from 'react';
import { BlocksContext } from '@/components/Provider/BlocksProvider';
import { IEmailTemplate } from '@/typings';
import { useFormState, useForm } from '@/utils/formBridge';

export function useEditorContext() {
  const formState = useFormState<IEmailTemplate>();
  const helpers = useForm();
  const { initialized, setInitialized } = useContext(BlocksContext);

  const content = formState.values?.content;
  return {
    formState,
    formHelpers: helpers,
    initialized,
    setInitialized,
    pageData: content,
  };
}
