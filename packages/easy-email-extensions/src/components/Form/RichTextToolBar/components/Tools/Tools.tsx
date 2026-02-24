import React, { useCallback, useRef } from 'react';
import { ToolItem } from '../ToolItem';
import { getLinkNode, Link, LinkParams } from '../Link';
import {
  AvailableTools,
  getShadowRoot,
  IconFont,
  MergeTagBadge,
  useEditorProps,
  useFocusBlockLayout,
} from 'easy-email-editor';
import { FontFamily } from '../FontFamily';
import { MergeTags } from '../MergeTags';
import { useSelectionRange } from '@extensions/AttributePanel/hooks/useSelectionRange';
import { IconBgColor } from './IconBgColor';
import { IconFontColor } from './IconFontColor';
import { BasicTools } from '../BasicTools';
import { Unlink } from '../Unlink';
import { StrikeThrough } from '../StrikeThrough';
import { Underline } from '../Underline';
import { Italic } from '../Italic';
import { Bold } from '../Bold';
import { FontSize } from '../FontSize';
import { RICH_TEXT_TOOL_BAR } from '@extensions/constants';

export interface ToolsProps {
  onChange: (content: string) => void;
}

export function Tools(props: ToolsProps) {
  const { mergeTags, enabledMergeTagsBadge, toolbar } = useEditorProps();
  const { focusBlockNode } = useFocusBlockLayout();
  const { selectionRange, restoreRange, setRangeByElement } = useSelectionRange();
  const { onChange } = props;

  // Keep a ref so execCommand always uses the latest range, even from inside popups
  const selectionRangeRef = useRef<Range | null>(selectionRange);
  selectionRangeRef.current = selectionRange;

  // Keep a ref to focusBlockNode so execCommand always uses the latest value
  const focusBlockNodeRef = useRef<Element | null | undefined>(focusBlockNode);
  focusBlockNodeRef.current = focusBlockNode;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const execCommand = useCallback(
    (cmd: string, val?: string | LinkParams) => {
      const range = selectionRangeRef.current;
      if (!range) {
        console.error(t('No selectionRange'));
        return;
      }
      if (!focusBlockNodeRef.current?.contains(range?.commonAncestorContainer)) {
        console.error(t('Not commonAncestorContainer'));
        return;
      }

      restoreRange(range);
      const uuid = (+new Date()).toString();
      if (cmd === 'createLink') {
        const linkData = val as LinkParams;
        const target = linkData.blank ? '_blank' : '';
        let link: HTMLAnchorElement | null;
        if (linkData.linkNode) {
          link = linkData.linkNode;
        } else {
          document.execCommand(cmd, false, uuid);
          link = getShadowRoot().querySelector(`a[href="${uuid}"`);
        }

        if (link) {
          if (target) {
            link.setAttribute('target', target);
          }
          link.style.color = 'inherit';
          link.style.textDecoration = linkData.underline ? 'underline' : 'none';
          link.setAttribute('href', linkData.link.trim());
        }
      } else if (cmd === 'insertHTML') {
        let newContent = val as string;
        if (enabledMergeTagsBadge) {
          newContent = MergeTagBadge.transform(newContent, uuid);
        }

        document.execCommand(cmd, false, newContent);
        const insertMergeTagEle = getShadowRoot().getElementById(uuid);
        if (insertMergeTagEle) {
          insertMergeTagEle.focus();
          setRangeByElement(insertMergeTagEle);
        }
      } else if (cmd === 'foreColor') {
        document.execCommand(cmd, false, val as string);
        let linkNode: HTMLAnchorElement | null = getLinkNode(range);
        if (linkNode) {
          linkNode.style.color = 'inherit';
        }
      } else {
        document.execCommand(cmd, false, val as string);
      }

      const contenteditableElement = getShadowRoot().activeElement;
      if (contenteditableElement?.getAttribute('contenteditable') === 'true') {
        const html = getShadowRoot().activeElement?.innerHTML || '';
        onChange(html);
      }
    },
    [
      enabledMergeTagsBadge,
      onChange,
      restoreRange,
      setRangeByElement,
    ],
  );

  const execCommandWithRange = useCallback(
    (cmd: string, val?: string) => {
      document.execCommand(cmd, false, val);
      const contenteditableElement = getShadowRoot().activeElement;
      if (contenteditableElement?.getAttribute('contenteditable') === 'true') {
        const html = getShadowRoot().activeElement?.innerHTML || '';
        onChange(html);
      }
    },
    [onChange],
  );

  const enabledTools = toolbar?.tools ?? [
    AvailableTools.MergeTags,
    AvailableTools.FontFamily,
    AvailableTools.FontSize,
    AvailableTools.Bold,
    AvailableTools.Italic,
    AvailableTools.StrikeThrough,
    AvailableTools.Underline,
    AvailableTools.IconFontColor,
    AvailableTools.IconBgColor,
    AvailableTools.Link,
    AvailableTools.Justify,
    AvailableTools.Lists,
    AvailableTools.HorizontalRule,
    AvailableTools.RemoveFormat,
  ];

  const tools = enabledTools.flatMap(tool => {
    switch (tool) {
      case AvailableTools.MergeTags:
        if (!mergeTags) return [];
        return [
          <MergeTags
            key={tool}
            execCommand={execCommand}
          />,
        ];
      case AvailableTools.FontFamily:
        return [
          <FontFamily
            key={tool}
            execCommand={execCommand}
          />,
        ];
      case AvailableTools.FontSize:
        return [
          <FontSize
            key={tool}
            execCommand={execCommand}
          />,
        ];
      case AvailableTools.Bold:
        return [
          <Bold
            key={tool}
            currentRange={selectionRange}
            onChange={() => execCommandWithRange('bold')}
          />,
        ];
      case AvailableTools.Italic:
        return [
          <Italic
            key={tool}
            currentRange={selectionRange}
            onChange={() => execCommandWithRange('italic')}
          />,
        ];
      case AvailableTools.StrikeThrough:
        return [
          <StrikeThrough
            key={tool}
            currentRange={selectionRange}
            onChange={() => execCommandWithRange('strikeThrough')}
          />,
        ];
      case AvailableTools.Underline:
        return [
          <Underline
            key={tool}
            currentRange={selectionRange}
            onChange={() => execCommandWithRange('underline')}
          />,
        ];
      case AvailableTools.IconFontColor:
        return [
          <IconFontColor
            key={tool}
            selectionRange={selectionRange}
            execCommand={execCommand}
          />,
        ];
      case AvailableTools.IconBgColor:
        return [
          <IconBgColor
            key={tool}
            selectionRange={selectionRange}
            execCommand={execCommand}
          />,
        ];
      case AvailableTools.Link:
        return [
          <Link
            key={`${tool}-link`}
            currentRange={selectionRange}
            onChange={values => execCommand('createLink', values)}
          />,
          <Unlink
            key={`${tool}-unlink`}
            currentRange={selectionRange}
            onChange={() => execCommand('')}
          />,
        ];
      case AvailableTools.Justify:
        return [
          <ToolItem
            key={`${tool}-justify-left`}
            onClick={() => execCommand('justifyLeft')}
            icon={<IconFont iconName="icon-align-left" />}
            title={'Align left'}
          />,
          <ToolItem
            key={`${tool}-justify-center`}
            onClick={() => execCommand('justifyCenter')}
            icon={<IconFont iconName="icon-align-center" />}
            title={'Align center'}
          />,
          <ToolItem
            key={`${tool}-justify-right`}
            onClick={() => execCommand('justifyRight')}
            icon={<IconFont iconName="icon-align-right" />}
            title={'Align right'}
          />,
        ];
      case AvailableTools.Lists:
        return [
          <ToolItem
            key={`${tool}-ordered-list`}
            onClick={() => execCommand('insertOrderedList')}
            icon={<IconFont iconName="icon-list-ol" />}
            title={'Orderlist'}
          />,
          <ToolItem
            key={`${tool}-unordered-list`}
            onClick={() => execCommand('insertUnorderedList')}
            icon={<IconFont iconName="icon-list-ul" />}
            title={'Unorderlist'}
          />,
        ];
      case AvailableTools.HorizontalRule:
        return [
          <ToolItem
            key={tool}
            onClick={() => execCommand('insertHorizontalRule')}
            icon={<IconFont iconName="icon-line" />}
            title={'Line'}
          />,
        ];
      case AvailableTools.RemoveFormat:
        return [
          <ToolItem
            key={tool}
            onClick={() => execCommand('removeFormat')}
            icon={<IconFont iconName="icon-close" />}
            title={'Remove format'}
          />,
        ];
      default:
        console.error('Not existing tool', tool);
        throw new Error(`Not existing tool ${tool}`);
    }
  });

  return (
    <div
      id={RICH_TEXT_TOOL_BAR}
      style={{ display: 'flex', flexWrap: 'nowrap' }}
    >
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <BasicTools />
          {tools.map((tool, index) => {
            return (
              <React.Fragment key={index}>
                {tool}
                <div
                  className="easy-email-extensions-divider"
                />
              </React.Fragment>
            );
          })}
        </div>
        {toolbar?.suffix?.(execCommand)}
      </>
    </div>
  );
}
