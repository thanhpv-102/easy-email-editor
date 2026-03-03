import React, { useEffect, useState } from 'react';

interface IPictureProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLImageElement>,
    HTMLElement
  > {
  src: string;
  className?: string;
}

const skeletonKeyframes = `
@keyframes easy-email-skeleton-shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
`;

let skeletonStyleInjected = false;
function injectSkeletonStyle() {
  if (skeletonStyleInjected) return;
  skeletonStyleInjected = true;
  const style = document.createElement('style');
  style.textContent = skeletonKeyframes;
  document.head.appendChild(style);
}

export function Picture(props: IPictureProps) {
  const [url, setUrl] = useState(props.src);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    injectSkeletonStyle();
  }, []);

  useEffect(() => {
    setUrl(props.src);
    setLoaded(false);
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
          position: 'relative',
          ...restStyle,
        },
      }}
    >
      {!loaded && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(70deg, var(--color-loading-gray-1, #2a2a2a) 25%, var(--color-loading-gray-2, #5a5a5a) 50%, var(--color-loading-gray-1, #2a2a2a) 75%)',
            backgroundSize: '800px 100%',
            animation: 'easy-email-skeleton-shimmer 1.4s infinite linear',
            borderRadius: borderRadius,
            display: 'block',
            zIndex: 1,
          }}
        />
      )}
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
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
        src={url}
        alt=''
        onLoad={() => setLoaded(true)}
      />
    </picture>
  );
}
