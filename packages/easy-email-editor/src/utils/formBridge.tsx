/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  useForm as useRHFForm,
  UseFormReturn,
  UseFormProps,
  FieldValues,
  FormProvider as RHFFormProvider,
  useFormContext,
  useWatch,
  useFormState as useRHFFormState
} from 'react-hook-form';
/**
 * Bridge types to mimic final-form API structure
 */
export interface FormApi<FormValues extends FieldValues = FieldValues, InitialFormValues = Partial<FormValues>> {
  batch: (fn: () => void) => void;
  blur: (name: string) => void;
  change: (name: string, value?: any) => void;
  focus: (name: string) => void;
  initialize: (values: InitialFormValues) => void;
  mutators: Record<string, (...args: any[]) => any>;
  reset: (values?: InitialFormValues) => void;
  submit: () => Promise<any>;
  getState: () => FormState<FormValues>;
  // Add react-hook-form methods for compatibility
  rhfForm: UseFormReturn<FormValues>;
}
export interface FormState<FormValues extends FieldValues = FieldValues> {
  active?: string;
  dirty: boolean;
  dirtyFields: Record<string, boolean>;
  dirtySinceLastSubmit: boolean;
  error?: any;
  errors: Record<string, any>;
  hasSubmitErrors: boolean;
  hasValidationErrors: boolean;
  initialValues?: FormValues;
  invalid: boolean;
  modified?: Record<string, boolean>;
  modifiedSinceLastSubmit: boolean;
  pristine: boolean;
  submitError?: any;
  submitErrors?: Record<string, any>;
  submitFailed: boolean;
  submitSucceeded: boolean;
  submitting: boolean;
  touched?: Record<string, boolean>;
  valid: boolean;
  validating: boolean;
  values: FormValues;
  visited?: Record<string, boolean>;
}
/**
 * Convert react-hook-form state to final-form compatible state
 */
export function useFormState<FormValues extends FieldValues = FieldValues>(): FormState<FormValues> {
  const rhfFormState = useRHFFormState<FormValues>();
  const { getValues } = useFormContext<FormValues>();
  const values = useWatch<FormValues>();
  return {
    dirty: rhfFormState.isDirty,
    dirtyFields: rhfFormState.dirtyFields as Record<string, boolean>,
    dirtySinceLastSubmit: false,
    errors: rhfFormState.errors as Record<string, any>,
    hasSubmitErrors: false,
    hasValidationErrors: !rhfFormState.isValid,
    initialValues: undefined,
    invalid: !rhfFormState.isValid,
    modifiedSinceLastSubmit: false,
    pristine: !rhfFormState.isDirty,
    submitFailed: false,
    submitSucceeded: rhfFormState.isSubmitSuccessful,
    submitting: rhfFormState.isSubmitting,
    touched: rhfFormState.touchedFields as Record<string, boolean>,
    valid: rhfFormState.isValid,
    validating: rhfFormState.isValidating,
    values: (values || getValues()) as FormValues,
  };
}
/**
 * Convert react-hook-form methods to final-form compatible API
 */
export function useForm<FormValues extends FieldValues = FieldValues>(): FormApi<FormValues> {
  const rhfForm = useFormContext<FormValues>();
  return {
    batch: (fn: () => void) => {
      fn();
    },
    blur: (_name: string) => {
      // React Hook Form doesn't have explicit blur
    },
    change: (name: string, value?: any) => {
      rhfForm.setValue(name as any, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });
    },
    focus: (name: string) => {
      rhfForm.setFocus(name as any);
    },
    initialize: (values: Partial<FormValues>) => {
      rhfForm.reset(values as any);
    },
    mutators: {
      setFieldTouched: (name: string, touched: boolean) => {
        rhfForm.setValue(name as any, rhfForm.getValues(name as any), {
          shouldTouch: touched,
        });
      },
    },
    reset: (values?: Partial<FormValues>) => {
      rhfForm.reset(values as any);
    },
    submit: () => {
      return rhfForm.handleSubmit((data) => data as any)() as Promise<any>;
    },
    getState: () => {
      const formState = rhfForm.formState;
      const values = rhfForm.getValues();
      return {
        dirty: formState.isDirty,
        dirtyFields: formState.dirtyFields as Record<string, boolean>,
        dirtySinceLastSubmit: false,
        errors: formState.errors as Record<string, any>,
        hasSubmitErrors: false,
        hasValidationErrors: !formState.isValid,
        invalid: !formState.isValid,
        modifiedSinceLastSubmit: false,
        pristine: !formState.isDirty,
        submitFailed: false,
        submitSucceeded: formState.isSubmitSuccessful,
        submitting: formState.isSubmitting,
        touched: formState.touchedFields as Record<string, boolean>,
        valid: formState.isValid,
        validating: formState.isValidating,
        values: values as FormValues,
      };
    },
    rhfForm: rhfForm as UseFormReturn<FormValues>,
  };
}
/**
 * useField hook compatible with final-form API
 */
export function useField(name: string, _config?: any) {
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(name, formState);
  return {
    input: {
      name,
      value: fieldState.error ? undefined : name,
      onChange: () => {},
      onBlur: () => {},
      onFocus: () => {},
    },
    meta: {
      active: false,
      data: {},
      dirty: fieldState.isDirty,
      dirtySinceLastSubmit: false,
      error: fieldState.error?.message,
      initial: undefined,
      invalid: fieldState.invalid,
      modified: false,
      modifiedSinceLastSubmit: false,
      pristine: !fieldState.isDirty,
      submitError: undefined,
      submitFailed: false,
      submitSucceeded: false,
      submitting: false,
      touched: fieldState.isTouched,
      valid: !fieldState.invalid,
      validating: false,
      visited: false,
    },
  };
}
export interface FormProps<FormValues extends FieldValues = FieldValues> extends UseFormProps<FormValues> {
  onSubmit: (values: FormValues) => void | Promise<any>;
  initialValues?: FormValues;
  validate?: (values: FormValues) => Record<string, any> | Promise<Record<string, any>>;
  mutators?: Record<string, any>;
  subscription?: any;
  children: (props: { handleSubmit: () => void }) => React.ReactNode;
}
/**
 * Form component compatible with react-final-form API
 */
export function Form<FormValues extends FieldValues = FieldValues>(props: FormProps<FormValues>) {
  const {
    onSubmit,
    initialValues,
    validate,
    children,
    mutators: _mutators,
    subscription: _subscription,
    ...restProps
  } = props;
  const methods = useRHFForm<FormValues>({
    defaultValues: initialValues as any,
    mode: 'onChange',
    ...restProps,
  });
  const handleSubmit = methods.handleSubmit(async (data) => {
    if (validate) {
      const errors = await validate(data);
      if (errors && Object.keys(errors).length > 0) {
        Object.entries(errors).forEach(([key, value]) => {
          methods.setError(key as any, { message: value as string });
        });
        return;
      }
    }
    await onSubmit(data);
  });
  return (
    <RHFFormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        {typeof children === 'function'
          ? children({ handleSubmit })
          : children}
      </form>
    </RHFFormProvider>
  );
}
/**
 * Field component compatible with react-final-form API
 */
export interface FieldRenderProps<FieldValue = any> {
  input: {
    name: string;
    value: FieldValue;
    onChange: (event: any) => void;
    onBlur: (event?: any) => void;
    onFocus: (event?: any) => void;
  };
  meta: {
    active: boolean;
    data: Record<string, any>;
    dirty: boolean;
    dirtySinceLastSubmit: boolean;
    error?: any;
    initial?: any;
    invalid: boolean;
    modified: boolean;
    modifiedSinceLastSubmit: boolean;
    pristine: boolean;
    submitError?: any;
    submitFailed: boolean;
    submitSucceeded: boolean;
    submitting: boolean;
    touched: boolean;
    valid: boolean;
    validating: boolean;
    visited: boolean;
  };
}
export interface FieldProps<FieldValue = any> {
  name: string;
  validate?: (value: FieldValue, allValues?: any) => string | undefined | Promise<string | undefined>;
  parse?: (value: any) => FieldValue;
  format?: (value: FieldValue) => any;
  children: (props: FieldRenderProps<FieldValue>) => React.ReactNode;
}
export function Field<FieldValue = any>(props: FieldProps<FieldValue>) {
  const { name, children, parse, format, validate } = props;
  const { register, setValue, getValues, formState, trigger } = useFormContext();
  const fieldState = formState.errors[name];
  const touchedFields = formState.touchedFields as Record<string, boolean>;
  const dirtyFields = formState.dirtyFields as Record<string, boolean>;
  const value = getValues(name as any);
  const handleChange = React.useCallback((event: any) => {
    let newValue = event?.target?.value ?? event;
    if (parse) {
      newValue = parse(newValue);
    }
    setValue(name as any, newValue, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true
    });
    if (validate) {
      trigger(name as any);
    }
  }, [name, parse, setValue, trigger, validate]);
  const handleBlur = React.useCallback((_event?: any) => {
    setValue(name as any, getValues(name as any), { shouldTouch: true });
    if (validate) {
      trigger(name as any);
    }
  }, [name, setValue, getValues, trigger, validate]);
  const handleFocus = React.useCallback(() => {
    // React Hook Form doesn't have explicit focus handling
  }, []);
  const fieldRenderProps: FieldRenderProps<FieldValue> = {
    input: {
      name,
      value: format ? format(value) : value,
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
    },
    meta: {
      active: false,
      data: {},
      dirty: dirtyFields[name] || false,
      dirtySinceLastSubmit: false,
      error: fieldState?.message,
      initial: undefined,
      invalid: !!fieldState,
      modified: false,
      modifiedSinceLastSubmit: false,
      pristine: !dirtyFields[name],
      submitError: undefined,
      submitFailed: false,
      submitSucceeded: formState.isSubmitSuccessful,
      submitting: formState.isSubmitting,
      touched: touchedFields[name] || false,
      valid: !fieldState,
      validating: formState.isValidating,
      visited: false,
    },
  };
  // Register field with validation
  React.useEffect(() => {
    if (validate) {
      register(name as any, {
        validate: async (val: FieldValue) => {
          const error = await validate(val, getValues());
          return error || true;
        },
      });
    } else {
      register(name as any);
    }
  }, [name, register, validate, getValues]);
  return <>{children(fieldRenderProps)}</>;
}
/**
 * FieldArray component compatible with react-final-form-arrays
 */
export interface FieldArrayRenderProps {
  fields: {
    name: string;
    value: any[];
    forEach: (callback: (name: string, index: number) => void) => void;
    insert: (index: number, value: any) => void;
    map: <T>(callback: (name: string, index: number) => T) => T[];
    move: (from: number, to: number) => void;
    pop: () => any;
    push: (value: any) => void;
    remove: (index: number) => void;
    shift: () => any;
    swap: (indexA: number, indexB: number) => void;
    unshift: (value: any) => void;
    update: (index: number, value: any) => void;
    length: number;
  };
  meta: {
    dirty: boolean;
    error?: any;
    invalid: boolean;
    pristine: boolean;
    submitFailed: boolean;
    submitting: boolean;
    touched: boolean;
    valid: boolean;
  };
}
export interface FieldArrayProps {
  name: string;
  validate?: (value: any[], allValues?: any) => string | undefined | Promise<string | undefined>;
  children: (props: FieldArrayRenderProps) => React.ReactNode;
}
export function FieldArray(props: FieldArrayProps) {
  const { name, children, validate } = props;
  const { getValues, setValue, formState, register } = useFormContext();
  const fieldState = formState.errors[name];
  const touchedFields = formState.touchedFields as Record<string, boolean>;
  const dirtyFields = formState.dirtyFields as Record<string, boolean>;
  const value = getValues(name as any) || [];
  React.useEffect(() => {
    if (validate) {
      register(name as any, {
        validate: async (val: any[]) => {
          const error = await validate(val, getValues());
          return error || true;
        },
      });
    } else {
      register(name as any);
    }
  }, [name, register, validate, getValues]);
  const fields = {
    name,
    value,
    length: value.length,
    forEach: (callback: (name: string, index: number) => void) => {
      value.forEach((_: any, index: number) => callback(`${name}[${index}]`, index));
    },
    map: <T,>(callback: (name: string, index: number) => T): T[] => {
      return value.map((_: any, index: number) => callback(`${name}[${index}]`, index));
    },
    push: (newValue: any) => {
      setValue(name as any, [...value, newValue], { shouldDirty: true });
    },
    pop: () => {
      const newValue = [...value];
      const popped = newValue.pop();
      setValue(name as any, newValue, { shouldDirty: true });
      return popped;
    },
    shift: () => {
      const newValue = [...value];
      const shifted = newValue.shift();
      setValue(name as any, newValue, { shouldDirty: true });
      return shifted;
    },
    unshift: (newValue: any) => {
      setValue(name as any, [newValue, ...value], { shouldDirty: true });
    },
    insert: (index: number, newValue: any) => {
      const newArray = [...value];
      newArray.splice(index, 0, newValue);
      setValue(name as any, newArray, { shouldDirty: true });
    },
    remove: (index: number) => {
      const newValue = value.filter((_: any, i: number) => i !== index);
      setValue(name as any, newValue, { shouldDirty: true });
    },
    update: (index: number, newValue: any) => {
      const newArray = [...value];
      newArray[index] = newValue;
      setValue(name as any, newArray, { shouldDirty: true });
    },
    move: (from: number, to: number) => {
      const newValue = [...value];
      const [removed] = newValue.splice(from, 1);
      newValue.splice(to, 0, removed);
      setValue(name as any, newValue, { shouldDirty: true });
    },
    swap: (indexA: number, indexB: number) => {
      const newValue = [...value];
      [newValue[indexA], newValue[indexB]] = [newValue[indexB], newValue[indexA]];
      setValue(name as any, newValue, { shouldDirty: true });
    },
  };
  const fieldArrayRenderProps: FieldArrayRenderProps = {
    fields,
    meta: {
      dirty: dirtyFields[name] || false,
      error: fieldState?.message,
      invalid: !!fieldState,
      pristine: !dirtyFields[name],
      submitFailed: false,
      submitting: formState.isSubmitting,
      touched: touchedFields[name] || false,
      valid: !fieldState,
    },
  };
  return <>{children(fieldArrayRenderProps)}</>;
}
// Export RegisterOptions as UseFieldConfig for backward compatibility
export type UseFieldConfig<TFieldValues extends FieldValues = FieldValues> = {
  validate?: (value: any, allValues?: any) => string | undefined | Promise<string | undefined>;
  parse?: (value: any) => any;
  format?: (value: any) => any;
};
