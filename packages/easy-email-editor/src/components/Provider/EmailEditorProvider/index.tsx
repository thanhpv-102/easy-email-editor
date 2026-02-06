import { IEmailTemplate } from '@/typings';
import { Form, useForm, useFormState, useField, FormApi, FormState } from '@/utils/formBridge';
import React, { useMemo, useEffect, useState } from 'react';
import { BlocksProvider } from '..//BlocksProvider';
import { HoverIdxProvider } from '../HoverIdxProvider';
import { PropsProvider, PropsProviderProps } from '../PropsProvider';
import { RecordProvider } from '../RecordProvider';
import { ScrollProvider } from '../ScrollProvider';
import { FocusBlockLayoutProvider } from '../FocusBlockLayoutProvider';
import { PreviewEmailProvider } from '../PreviewEmailProvider';
import { LanguageProvider } from '../LanguageProvider';
import { overrideErrorLog, restoreErrorLog } from '@/utils/logger';

export interface EmailEditorProviderProps<T extends IEmailTemplate = any>
  extends Omit<PropsProviderProps, 'children'> {
  data: T;
  children: (
    props: FormState<T>,
    helper: FormApi<IEmailTemplate, Partial<IEmailTemplate>>,
  ) => React.ReactNode;
  onSubmit?: (values: IEmailTemplate) => void | Promise<any>;
  validationSchema?: (values: IEmailTemplate) => Record<string, any> | Promise<Record<string, any>>;
}

export const EmailEditorProvider = <T extends any>(
  props: EmailEditorProviderProps & T,
) => {
  const { data, children, onSubmit = () => {}, validationSchema } = props;

  const initialValues = useMemo(() => {
    return {
      subject: data.subject,
      subTitle: data.subTitle,
      content: data.content,
    };
  }, [data]);

  useEffect(() => {
    overrideErrorLog();
    return () => {
      restoreErrorLog();
    };
  }, []);

  if (!initialValues.content) return null;

  return (
    <Form<IEmailTemplate>
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validationSchema}
    >
      {() => (
        <>
          <PropsProvider {...props}>
            <LanguageProvider locale={props.locale}>
              <PreviewEmailProvider>
                <RecordProvider>
                  <BlocksProvider>
                    <HoverIdxProvider>
                      <ScrollProvider>
                        <FocusBlockLayoutProvider>
                          <FormWrapper children={children} />
                        </FocusBlockLayoutProvider>
                      </ScrollProvider>
                    </HoverIdxProvider>
                  </BlocksProvider>
                </RecordProvider>
              </PreviewEmailProvider>
            </LanguageProvider>
          </PropsProvider>
          <RegisterFields />
        </>
      )}
    </Form>
  );
};

function FormWrapper({ children }: { children: EmailEditorProviderProps['children'] }) {
  const data = useFormState<IEmailTemplate>();
  const helper = useForm<IEmailTemplate>();
  return <>{children(data, helper)}</>;
}

// final-form bug https://github.com/final-form/final-form/issues/169

const RegisterFields = React.memo(() => {
  const { touched } = useFormState<IEmailTemplate>();
  const [touchedMap, setTouchedMap] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (touched) {
      Object.keys(touched)
        .filter(key => touched[key])
        .forEach(key => {
          setTouchedMap(obj => {
            obj[key] = true;
            return { ...obj };
          });
        });
    }
  }, [touched]);

  return (
    <>
      {Object.keys(touchedMap).map(key => {
        return (
          <RegisterField
            key={key}
            name={key}
          />
        );
      })}
    </>
  );
});

function RegisterField({ name }: { name: string }) {
  useField(name);
  return <></>;
}
