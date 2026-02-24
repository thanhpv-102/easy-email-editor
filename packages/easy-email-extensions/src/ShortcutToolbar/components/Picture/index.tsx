import React, { useEffect, useState } from 'react';

interface IPictureProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLImageElement>,
    HTMLElement
  > {
  src: string;
  className?: string;
}

export function Picture(props: IPictureProps) {
  const [url, setUrl] = useState(props.src);

  useEffect(() => {
    setUrl(props.src);
  }, [props.src]);

  const { width, height, borderRadius, padding, ...restStyle } = props.style || {};

  return (
    <picture
      {...{ ...props }}
      {...{
        src: undefined,
        style: {
          display: 'inline-block',
          width: width,
          height: height,
          borderRadius: borderRadius,
          padding: padding,
          overflow: borderRadius ? 'hidden' : undefined,
          ...restStyle,
        },
      }}
    >
      <source
        srcSet={url}
      />
      <img
        style={{
          width: width || '100%',
          height: height || '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          display: 'block',
        }}
        src={url}
        alt=''
      />
    </picture>
  );
}
