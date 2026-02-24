/* eslint-disable react/jsx-wrap-multilines */
import React, { useCallback, useRef, useState } from 'react';
import { Modal, Tabs, Form, Switch, Button, Typography, Popconfirm, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEditorConfig, useEditorProps } from 'easy-email-editor';

const { Text } = Typography;

// ─── General Tab ─────────────────────────────────────────────────────────────

function GeneralTab() {
  const { runtimeConfig, setRuntimeConfig } = useEditorConfig();
  const { dashed: propDashed = true } = useEditorProps();
  const currentDashed = runtimeConfig.dashed !== undefined ? runtimeConfig.dashed : propDashed;

  return (
    <Form layout='vertical' style={{ padding: '16px 0' }}>
      <Form.Item
        label='Dashed border (show dashed outline around blocks)'
        help='Enable or disable dashed borders on email blocks'
      >
        <Switch
          checked={currentDashed}
          onChange={val => setRuntimeConfig({ dashed: val })}
          checkedChildren='On'
          unCheckedChildren='Off'
        />
      </Form.Item>
    </Form>
  );
}

// ─── Merge Tags Tab ──────────────────────────────────────────────────────────

interface FlatMergeTag {
  id: string;
  path: string;
  value: string;
}

function flattenMergeTags(obj: Record<string, unknown>, prefix = ''): FlatMergeTag[] {
  const result: FlatMergeTag[] = [];
  for (const key of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      result.push(...flattenMergeTags(val as Record<string, unknown>, path));
    } else {
      result.push({ id: path, path, value: String(val ?? '') });
    }
  }
  return result;
}

function buildMergeTagsFromFlat(flat: FlatMergeTag[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const item of flat) {
    const parts = item.path.split('.');
    let cur = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!cur[part] || typeof cur[part] !== 'object') cur[part] = {};
      cur = cur[part] as Record<string, unknown>;
    }
    cur[parts[parts.length - 1]] = item.value;
  }
  return result;
}

interface MergeTagRowProps {
  row: FlatMergeTag;
  onCommit: (id: string, field: 'path' | 'value', val: string) => void;
  onDelete: (id: string) => void;
}

// Each row owns its own input state → typing never re-renders the parent list
function MergeTagRow({ row, onCommit, onDelete }: MergeTagRowProps) {
  const pathRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
      <input
        ref={pathRef}
        defaultValue={row.path}
        placeholder='e.g. user.name'
        onBlur={e => onCommit(row.id, 'path', e.target.value)}
        style={inputStyle}
      />
      <input
        ref={valueRef}
        defaultValue={row.value}
        placeholder='Preview value'
        onBlur={e => onCommit(row.id, 'value', e.target.value)}
        style={inputStyle}
      />
      <Popconfirm title='Delete this tag?' onConfirm={() => onDelete(row.id)}>
        <Button type='text' danger size='small' icon={<DeleteOutlined />} />
      </Popconfirm>
    </div>
  );
}

function MergeTagsTab() {
  const { runtimeConfig, setRuntimeConfig } = useEditorConfig();
  const { mergeTags: propMergeTags } = useEditorProps();

  const initialMergeTags =
    runtimeConfig.mergeTags !== undefined
      ? runtimeConfig.mergeTags
      : ((propMergeTags as Record<string, unknown>) ?? {});

  const [rows, setRows] = useState<FlatMergeTag[]>(() =>
    flattenMergeTags(initialMergeTags as Record<string, unknown>),
  );
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  const syncToContext = useCallback(
    (nextRows: FlatMergeTag[]) => {
      setRuntimeConfig({ mergeTags: buildMergeTagsFromFlat(nextRows) });
    },
    [setRuntimeConfig],
  );

  // Called onBlur from each row — only updates the specific field, no re-render of list
  const handleCommit = useCallback(
    (id: string, field: 'path' | 'value', val: string) => {
      const nextRows = rowsRef.current.map(r => {
        if (r.id !== id) return r;
        return field === 'path' ? { ...r, path: val, id: val } : { ...r, value: val };
      });
      rowsRef.current = nextRows;
      // Update rows state only to keep rowsRef consistent for add/delete, but
      // use functional update to avoid triggering unnecessary re-renders when value unchanged
      setRows(prev => {
        const changed = prev.some(r => {
          if (r.id !== id) return false;
          return field === 'path' ? r.path !== val : r.value !== val;
        });
        if (!changed) return prev;
        return prev.map(r => {
          if (r.id !== id) return r;
          return field === 'path' ? { ...r, path: val, id: val } : { ...r, value: val };
        });
      });
      syncToContext(nextRows);
    },
    [syncToContext],
  );

  const handleDelete = useCallback(
    (id: string) => {
      const nextRows = rowsRef.current.filter(r => r.id !== id);
      setRows(nextRows);
      syncToContext(nextRows);
    },
    [syncToContext],
  );

  const handleAdd = useCallback(() => {
    const ts = Date.now();
    const newRow: FlatMergeTag = { id: `new.key.${ts}`, path: `new.key.${ts}`, value: '' };
    const nextRows = [...rowsRef.current, newRow];
    setRows(nextRows);
    syncToContext(nextRows);
  }, [syncToContext]);

  return (
    <div style={{ padding: '16px 0' }}>
      <Text type='secondary' style={{ display: 'block', marginBottom: 12 }}>
        Define merge tag preview values. Use dot notation for nested keys (e.g.{' '}
        <Text code>user.name</Text>).
      </Text>
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        <Text strong style={{ flex: 1, fontSize: 12 }}>Path (dot notation)</Text>
        <Text strong style={{ flex: 1, fontSize: 12 }}>Value</Text>
        <div style={{ width: 32 }} />
      </div>
      <Divider style={{ margin: '4px 0 8px' }} />
      {rows.map(row => (
        <MergeTagRow key={row.id} row={row} onCommit={handleCommit} onDelete={handleDelete} />
      ))}
      <Button icon={<PlusOutlined />} onClick={handleAdd} size='small' style={{ marginTop: 4 }}>
        Add merge tag
      </Button>
    </div>
  );
}

// ─── Social Icons Tab ─────────────────────────────────────────────────────────

interface SocialIconRow {
  id: string;
  content: string;
  image: string;
}

interface SocialIconRowProps {
  row: SocialIconRow;
  onCommit: (id: string, field: 'content' | 'image', val: string) => void;
  onDelete: (id: string) => void;
}

function SocialIconRowItem({ row, onCommit, onDelete }: SocialIconRowProps) {
  const [imgSrc, setImgSrc] = useState(row.image);

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
      <input
        defaultValue={row.content}
        placeholder='e.g. Facebook'
        onBlur={e => onCommit(row.id, 'content', e.target.value)}
        style={inputStyle}
      />
      <div style={{ flex: 1, display: 'flex', gap: 6, alignItems: 'center' }}>
        <input
          defaultValue={row.image}
          placeholder='https://...'
          onBlur={e => {
            onCommit(row.id, 'image', e.target.value);
            setImgSrc(e.target.value);
          }}
          style={{ ...inputStyle, flex: 1 }}
        />
        {imgSrc && (
          <img src={imgSrc} alt='' style={{ width: 24, height: 24, objectFit: 'contain', flexShrink: 0 }} />
        )}
      </div>
      <Popconfirm title='Delete this icon?' onConfirm={() => onDelete(row.id)}>
        <Button type='text' danger size='small' icon={<DeleteOutlined />} />
      </Popconfirm>
    </div>
  );
}

function SocialIconsTab() {
  const { runtimeConfig, setRuntimeConfig } = useEditorConfig();
  const { socialIcons: propSocialIcons } = useEditorProps();

  const currentIcons =
    runtimeConfig.socialIcons !== undefined ? runtimeConfig.socialIcons : (propSocialIcons ?? []);

  const [rows, setRows] = useState<SocialIconRow[]>(() =>
    currentIcons.map((icon, i) => ({ ...icon, id: `icon-${i}` })),
  );
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  const syncToContext = useCallback(
    (nextRows: SocialIconRow[]) => {
      setRuntimeConfig({ socialIcons: nextRows.map(({ content, image }) => ({ content, image })) });
    },
    [setRuntimeConfig],
  );

  const handleCommit = useCallback(
    (id: string, field: 'content' | 'image', val: string) => {
      const nextRows = rowsRef.current.map(r => (r.id === id ? { ...r, [field]: val } : r));
      rowsRef.current = nextRows;
      setRows(prev => {
        const changed = prev.some(r => r.id === id && r[field] !== val);
        if (!changed) return prev;
        return prev.map(r => (r.id === id ? { ...r, [field]: val } : r));
      });
      syncToContext(nextRows);
    },
    [syncToContext],
  );

  const handleDelete = useCallback(
    (id: string) => {
      const nextRows = rowsRef.current.filter(r => r.id !== id);
      setRows(nextRows);
      syncToContext(nextRows);
    },
    [syncToContext],
  );

  const handleAdd = useCallback(() => {
    const newRow: SocialIconRow = { id: `icon-new-${Date.now()}`, content: '', image: '' };
    const nextRows = [...rowsRef.current, newRow];
    setRows(nextRows);
    syncToContext(nextRows);
  }, [syncToContext]);

  return (
    <div style={{ padding: '16px 0' }}>
      <Text type='secondary' style={{ display: 'block', marginBottom: 12 }}>
        Define custom social icons available in the social block.
      </Text>
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        <Text strong style={{ flex: 1, fontSize: 12 }}>Name / Label</Text>
        <Text strong style={{ flex: 1, fontSize: 12 }}>Image URL</Text>
        <div style={{ width: 32 }} />
      </div>
      <Divider style={{ margin: '4px 0 8px' }} />
      {rows.map(row => (
        <SocialIconRowItem key={row.id} row={row} onCommit={handleCommit} onDelete={handleDelete} />
      ))}
      <Button icon={<PlusOutlined />} onClick={handleAdd} size='small' style={{ marginTop: 4 }}>
        Add social icon
      </Button>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '3px 7px',
  fontSize: 14,
  lineHeight: '22px',
  border: '1px solid #d9d9d9',
  borderRadius: 6,
  outline: 'none',
  boxSizing: 'border-box',
  width: '100%',
};

// ─── Main Popup ───────────────────────────────────────────────────────────────

export function ConfigurationPopup() {
  const { isConfigOpen, closeConfig } = useEditorConfig();

  return (
    <Modal
      open={isConfigOpen}
      onCancel={closeConfig}
      title='Editor Configuration'
      footer={(
        <Button type='primary' onClick={closeConfig}>
          Done
        </Button>
      )}
      width={680}
    >
      <Tabs
        defaultActiveKey='general'
        items={[
          {
            key: 'general',
            label: 'General',
            children: <GeneralTab />,
          },
          {
            key: 'merge-tags',
            label: 'Merge Tags',
            children: <MergeTagsTab />,
          },
          {
            key: 'social-icons',
            label: 'Social Icons',
            children: <SocialIconsTab />,
          },
        ]}
      />
    </Modal>
  );
}
