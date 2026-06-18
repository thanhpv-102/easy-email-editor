import { classnames } from '@/utils/classnames';
import React from 'react';

export function IconFont(props: {
  iconName: string;
  hoverColor?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onClickCapture?: React.MouseEventHandler<HTMLDivElement>;
  size?: number;
  style?: React.CSSProperties;
  title?: string;
}) {
  const [isHover, setIsHover] = React.useState(false);
  const { hoverColor, style } = props;

  return (
    <div
      title={props.title}
      onClick={props.onClick}
      onClickCapture={props.onClickCapture}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        cursor: 'pointer',
        pointerEvents: 'auto',
        ...(style as any),
        color: isHover && hoverColor ? hoverColor : style?.color || 'inherit',
        fontSize: props.size || (style as any)?.fontSize,
      }}
      className={classnames('iconfont', props.iconName)}
    />
  );
}
