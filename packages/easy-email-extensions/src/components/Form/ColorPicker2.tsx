/* eslint-disable react/jsx-wrap-multilines */
import { Input, Popover, PopoverProps } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { PresetColorsContext } from '../../AttributePanel/components/provider/PresetColorsProvider';
import { getImg } from '@extensions/AttributePanel/utils/getImg';
import styles from './index.module.scss';

export interface ColorPickerProps extends Omit<PopoverProps, 'content' | 'title'> {
  onChange?: (val: string) => void;
  value?: string;
  label: string;
  children?: React.ReactNode;
  showInput?: boolean;
}

export function ColorPicker(props: ColorPickerProps) {
  const { colors: presetColors, addCurrentColor } = useContext(PresetColorsContext);
  const [color, setColor] = useState('');
  const { value = '', onChange, children, showInput = true } = props;

  useEffect(() => {
    setColor(value);
  }, [value]);

  const onChangeComplete = useCallback(
    (newColor: string) => {
      if (newColor && newColor.replace('#', '').length < 6) return;
      setColor(newColor);
      onChange?.(newColor);
      addCurrentColor(newColor);
    },
    [addCurrentColor, onChange],
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setColor(newValue);
      onChange?.(newValue);
      addCurrentColor(newValue);
    },
    [addCurrentColor, onChange],
  );
  return (
    <div style={{ flex: 1, display: 'flex' }}>
      <Popover
        title={props.label}
        trigger='click'
        {...props}
        placement='top'
        content={
          <div className={styles.colorPicker}>
            <HexColorPicker
              color={color}
              onChange={onChangeComplete}
            />
            {presetColors && presetColors.length > 0 && (
              <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {presetColors.map((presetColor: string, index: number) => (
                  <div
                    key={index}
                    onClick={() => onChangeComplete(presetColor)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      backgroundColor: presetColor,
                      cursor: 'pointer',
                      border: '1px solid #ddd',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        }
      >
        <div style={{ display: 'inline-flex' }}>
          {children || (
            <div
              style={{
                display: 'inline-block',
                height: 32,
                width: 32,
                boxSizing: 'border-box',
                padding: 4,
                border: '1px solid var(--color-neutral-3, rgb(229, 230, 235))',
                borderRadius: showInput ? undefined : 4,
                fontSize: 0,
                borderRight: showInput ? 'none' : undefined,
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              {props.value ? (
                <span
                  style={{
                    position: 'relative',
                    display: 'block',
                    border: '1px solid var(--color-neutral-3, rgb(229, 230, 235))',
                    borderRadius: 2,
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    backgroundColor: value,
                  }}
                />
              ) : (
                <img
                  alt="Color picker"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    filter: 'invert(  0.78  )  drop-shadow(0 0px 0 rgb(0 0 0 / 45%))',
                  }}
                  src={getImg('AttributePanel_02')}
                />
              )}
            </div>
          )}
        </div>
      </Popover>
      {showInput && (
        <Input
          value={props.value}
          style={{ outline: 'none', flex: 1 }}
          onChange={onInputChange}
        />
      )}
    </div>
  );
}
