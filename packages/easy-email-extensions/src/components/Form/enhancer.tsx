import { Field, UseFieldConfig } from 'easy-email-editor';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRefState } from 'easy-email-editor';
import { debounce } from 'lodash';
import { Form, FormItemProps } from 'antd';

export interface EnhancerProps {
  name: string;
  onChangeAdapter?: (value: any) => any;
  validate?: (value: any) => string | undefined | Promise<string | undefined>;
  config?: UseFieldConfig;
  changeOnBlur?: boolean;
  formItem?: FormItemProps;
  label?: FormItemProps['label'];
  inline?: boolean;
  equalSpacing?: boolean;
  required?: boolean;
  autoComplete?: 'on' | 'off';
  style?: React.CSSProperties;
  helpText?: React.ReactNode;
  debounceTime?: number;
  labelHidden?: boolean;
}

const parse = (v: any) => v;
export default function enhancer<P extends { onChange?: (...rest: any) => any }>(
  Component: React.FC<any>,
  changeAdapter: (args: Parameters<NonNullable<P['onChange']>>) => any,
  option?: { debounceTime: number },
) {
  return (props: EnhancerProps & Omit<P, 'value' | 'onChange' | 'mutators'>) => {
    const {
      name,
      validate,
      onChangeAdapter,
      changeOnBlur,
      inline,
      equalSpacing,
      formItem,
      label,
      required,
      style,
      helpText,
      autoComplete,
      labelHidden,
      ...rest
    } = props;

    const debounceTime = props.debounceTime || option?.debounceTime || 300;

    const config = useMemo(() => {
      return {
        ...props.config,
        validate: validate,
        parse: props.config?.parse || parse,
      };
    }, [props.config, validate]);

    const [currentValue, setCurrentValue] = useState<any>(undefined);
    const currentValueRef = useRefState(currentValue);
    const isFocusedRef = useRef(false);

    const layoutStyle = useMemo((): FormItemProps => {
      if (equalSpacing) {
        return {
          labelCol: {
            span: 11,
            style: {
              textAlign: 'left',
              paddingRight: 0,
            },
          },
          wrapperCol: {
            span: 11,
            offset: 1,
            style: {
              textAlign: 'right',
            },
          },
        };
      }
      if (inline) {
        return {
          labelCol: {
            span: 7,
            style: {
              textAlign: 'right',
              paddingRight: 0,
            },
          },
          wrapperCol: {
            span: 16,
            offset: 1,
            style: {},
          },
        };
      }

      return {
        labelCol: {
          span: 24,
          style: {
            paddingRight: 0,
          },
        },
        wrapperCol: {
          span: 24,
        },
      };
    }, [equalSpacing, inline]);

    return useMemo(() => {
      return (
        <Field
          name={name}
          {...config}
        >
          {({ input: { onBlur, onChange, value }, meta }) => {
            // eslint-disable-next-line react-hooks/exhaustive-deps

            const debounceCallbackChange = useCallback(
              debounce(
                val => {
                  onChange(val);
                  onBlur();
                },
                debounceTime,
                {
                  // maxWait: 500,
                },
              ),
              [onChange, onBlur],
            );

            const onFieldChange: P['onChange'] = useCallback(
              (e: any) => {
                const adapted = onChangeAdapter
                  ? onChangeAdapter(changeAdapter(e))
                  : changeAdapter(e);

                // If the adapter returned a synthetic/native Event, extract its value
                // so we never show [object Object] in the input.
                let newVal: any;
                if (
                  adapted !== null &&
                  typeof adapted === 'object' &&
                  !Array.isArray(adapted) &&
                  'target' in adapted &&
                  (adapted as { target: unknown }).target !== null
                ) {
                  const rawVal = (adapted as { target: { value: unknown } }).target.value;
                  newVal = rawVal == null ? '' : String(rawVal);
                } else if (Array.isArray(adapted) || (adapted !== null && typeof adapted === 'object')) {
                  newVal = adapted;
                } else {
                  newVal = adapted == null ? '' : String(adapted);
                }

                setCurrentValue(newVal);
                if (!changeOnBlur) {
                  debounceCallbackChange(newVal);
                }
              },
              [debounceCallbackChange],
            );

            const onFieldBlur = useCallback(() => {
              isFocusedRef.current = false;
              if (changeOnBlur) {
                onChange(currentValueRef.current);
                onBlur();
              }
            }, [onBlur, onChange]);

            const onFieldFocus = useCallback(() => {
              isFocusedRef.current = true;
            }, []);

            useEffect(() => {
              // Only sync form value → input when the input is not focused.
              // While focused the user is typing; overwriting currentValue would
              // cause visible glitches and lost keystrokes.
              if (!isFocusedRef.current) {
                if (Array.isArray(value) || (value !== null && typeof value === 'object')) {
                  setCurrentValue(value);
                } else {
                  setCurrentValue(value == null ? '' : String(value));
                }
              }
            }, [value]);

            return (
              <Form.Item
                style={{
                  ...style,
                  margin: '0px',
                }}
                rules={required ? [{ required: true }] : undefined}
                {...layoutStyle}
                {...formItem}
                label={labelHidden ? undefined : label || formItem?.label}
                labelAlign='left'
                validateStatus={meta.touched && meta.error ? 'error' : undefined}
                help={meta.touched && meta.error ? meta.error : helpText}
              >
                <Component
                  autoComplete={autoComplete}
                  {...rest}
                  name={name}
                  checked={currentValue}
                  value={currentValue}
                  onChange={onFieldChange}
                  onBlur={onFieldBlur}
                  onFocus={onFieldFocus}
                />
              </Form.Item>
            );
          }}
        </Field>
      );
    }, [
      autoComplete,
      changeOnBlur,
      config,
      currentValue,
      currentValueRef,
      debounceTime,
      formItem,
      helpText,
      label,
      labelHidden,
      layoutStyle,
      name,
      onChangeAdapter,
      required,
      rest,
      style,
    ]);
  };
}
