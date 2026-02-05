import { camelCase } from 'lodash';
import React from 'react';
import { getNodeTypeFromClassName } from 'easy-email-core';

const domParser = new DOMParser();

export function getChildSelector(selector: string, index: number) {
  return `${selector}-${index}`;
}

export function HtmlStringToPreviewReactNodes(
  content: string,
) {
  let doc = domParser.parseFromString(content, 'text/html'); // The average time is about 1.4 ms

  // In React 19, we can't render the entire documentElement (html, head, body)
  // Extract only the body content to avoid multiple document element errors
  const bodyElement = doc.body;
  if (!bodyElement) {
    return <div>No content</div>;
  }

  const reactNode = (
    <RenderReactNode selector={'0'} node={bodyElement} index={0} />
  );

  return reactNode;
}

const RenderReactNode = React.memo(function ({
  node,
  index,
  selector,
}: {
  node: HTMLElement;
  index: number;
  selector: string;
}): React.ReactElement {
  const attributes: { [key: string]: string; } = {
    'data-selector': selector,
  };
  node.getAttributeNames?.().forEach((att) => {
    if (att) {
      attributes[att] = node.getAttribute(att) || '';
    }
  });

  if (node.nodeType === Node.COMMENT_NODE) return <></>;

  if (node.nodeType === Node.TEXT_NODE) {
    return <>{node.textContent}</>;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const tagName = node.tagName.toLowerCase();
    if (tagName === 'meta') return <></>;

    // Prevent body elements from being nested in divs (React 19 hydration issue)
    if (tagName === 'body') {
      // Return the body's children instead of the body element itself
      return (
        <>
          {[...node.childNodes].map((n, i) => (
            <RenderReactNode
              selector={getChildSelector(selector, i)}
              key={i}
              node={n as any}
              index={i}
            />
          ))}
        </>
      );
    }

    if (tagName === 'style') {
      return React.createElement(tagName, {
        key: index,
        ...attributes,
        dangerouslySetInnerHTML: { __html: node.textContent },
      });
    }

    const blockType = getNodeTypeFromClassName(node.classList);

    if (attributes['data-contenteditable'] === 'true') {
      return React.createElement(tagName, {
        key: performance.now(),
        ...attributes,
        style: getStyle(node.getAttribute('style')),
        dangerouslySetInnerHTML: { __html: node.innerHTML },
      });
    }

    // Filter out whitespace text nodes for table elements to prevent hydration errors
    const isTableElement = ['table', 'tbody', 'thead', 'tfoot', 'tr'].includes(tagName);
    const filteredChildNodes = isTableElement
      ? [...node.childNodes].filter(n => {
          // Remove whitespace-only text nodes in table elements
          return !(n.nodeType === Node.TEXT_NODE && (!n.textContent || n.textContent.trim() === ''));
        })
      : [...node.childNodes];

    const reactNode = React.createElement(tagName, {
      key: index,
      ...attributes,
      style: getStyle(node.getAttribute('style')),
      children:
        filteredChildNodes.length === 0
          ? null
          : filteredChildNodes.map((n, i) => (
            <RenderReactNode
              selector={getChildSelector(selector, i)}
              key={i}
              node={n as any}
              index={i}
            />
          )),
    });

    return <>{reactNode}</>;
  }

  return <></>;
});

function getStyle(styleText: string | null) {
  if (!styleText) return undefined;
  return styleText.split(';').reduceRight((a: any, b: any) => {
    const arr = b.split(/\:(?!\/)/);
    if (arr.length < 2) return a;
    a[camelCase(arr[0])] = arr[1];
    return a;
  }, {});
}
