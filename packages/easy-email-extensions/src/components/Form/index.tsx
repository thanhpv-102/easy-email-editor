import {
  Input as AntdInput,
  InputNumber,
  InputNumberProps,
  Slider,
  Switch,
  SwitchProps,
  TreeSelect,
  TreeSelectProps,
} from 'antd';
import type { SliderSingleProps } from 'antd/es/slider';
import type { TextAreaProps } from 'antd/es/input';
import type { SearchProps as InputSearchProps } from 'antd/es/input/Search';
import { ImageUploader, ImageUploaderProps } from './ImageUploader';
import { Select, SelectProps } from './Select';
import { RadioGroup, RadioGroupProps } from './RadioGroup';
import enhancer, { EnhancerProps } from './enhancer';
import { Input, InputProps } from './Input';
import { InputWithUnit, InputWithUnitProps } from './InputWithUnit';
import { CheckBoxGroup, CheckboxGroupProps } from './CheckBoxGroup';
import { EditTab, EditTabProps } from './EditTab';
import { EditGridTab, EditGridTabProps } from './EditGridTab';
import { AutoComplete, AutoCompleteProps } from './AutoComplete';
import { ColorPickerField } from './ColorPickerField';

export { RichTextField } from './RichTextField';

export const TextField = enhancer<InputProps>(Input, value => value);

export const InputWithUnitField = enhancer<InputWithUnitProps>(
  InputWithUnit,
  value => value,
);

export const SearchField = enhancer<InputSearchProps>(AntdInput.Search, val => val);

export const TextAreaField = enhancer<TextAreaProps>(AntdInput.TextArea, val => val);

export const NumberField: React.FC<EnhancerProps & Omit<InputNumberProps, 'value' | 'onChange' | 'mutators'>> = enhancer<InputNumberProps>(InputNumber, e => e);

export const SliderField = enhancer<SliderSingleProps>(Slider, e => e);

export const ImageUploaderField = enhancer<ImageUploaderProps>(ImageUploader, url => url);

export const SelectField = enhancer<SelectProps>(Select, e => e);

export const TreeSelectField: React.FC<EnhancerProps & Omit<TreeSelectProps, 'value' | 'onChange' | 'mutators'>> = enhancer<TreeSelectProps>(TreeSelect, e => e);

export const AutoCompleteField = enhancer<AutoCompleteProps>(AutoComplete, e => e);

export const RadioGroupField = enhancer<RadioGroupProps>(RadioGroup, value => value);

export const SwitchField = enhancer<SwitchProps>(Switch, e => e);

export const CheckboxField = enhancer<CheckboxGroupProps>(CheckBoxGroup, e => e);

export const EditTabField = enhancer<EditTabProps>(EditTab, (e: unknown[]) => e);
export const EditGridTabField = enhancer<EditGridTabProps>(EditGridTab, (e: unknown[]) => e);

export { ColorPickerField };

export { enhancer };
