import React, { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import type { AssetManagerProps, FileItem, FolderItem } from './types';
import './styles.css';
import { FolderAddOutlined, DeleteOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';

function isFile(item: FileItem | FolderItem): item is FileItem {
  return item.type === 'FILE';
}

function isFolder(item: FileItem | FolderItem): item is FolderItem {
  return item.type === 'FOLDER';
}

export const AssetManager: React.FC<AssetManagerProps> = (
  {
    accept = 'image/*',
    request,
    title = 'Asset Manager',
    upload,
    onCreateFile,
    onDeleteFile,
    onDeleteFolder,
    onUpdateFile: _onUpdateFile,
    onUpdateFolder: _onUpdateFolder,
    onCreateFolder,
    onSelect,
    visible = false,
    setVisible,
    showUnacceptedFile: _showUnacceptedFile = false,
    addFolderEnabled = true,
  }) => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [items, setItems] = useState<Array<FileItem | FolderItem>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<FolderItem[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FileItem | FolderItem | null>(null);
  const [viewMode, setViewMode] = useState<'thumbnail' | 'list'>('thumbnail');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    setError(null);
    request(currentFolderId === null ? undefined : currentFolderId)
      .then((data) => setItems(data))
      .catch((e: any) => setError(e?.message || 'Failed to load assets'))
      .finally(() => setLoading(false));
  }, [currentFolderId, visible, request]);

  useEffect(() => {
    if (!visible) return;
    if (currentFolderId === null) {
      setBreadcrumbs([]);
    }
  }, [currentFolderId, visible]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setCurrentFolderId(null);
    setBreadcrumbs([]);
    setError(null);
  };

  const handleBreadcrumbClick = (idx: number) => {
    if (idx === -1) {
      setCurrentFolderId(null);
      setBreadcrumbs([]);
    } else {
      setCurrentFolderId(breadcrumbs[idx].id);
      setBreadcrumbs(breadcrumbs.slice(0, idx + 1));
    }
  };

  const handleDeleteFile = async (file: FileItem) => {
    setLoading(true);
    await onDeleteFile({ id: file.id });
    setItems((items) => items.filter((i) => i !== file));
    setLoading(false);
  };
  const handleDeleteFolder = async (folder: FolderItem) => {
    setLoading(true);
    await onDeleteFolder({ id: folder.id });
    setItems((items) => items.filter((i) => i !== folder));
    setLoading(false);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    setLoading(true);
    const folder = await onCreateFolder({ name: newFolderName, parentFolderId: currentFolderId });
    setItems((items) => [...items, folder]);
    setNewFolderName('');
    setCreatingFolder(false);
    setLoading(false);
  };

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      if (accept && !file.type.match(accept.replace('*', '.*'))) {
        continue;
      }
      const url = await upload(file);
      const fileItem = await onCreateFile({ name: file.name, url, parentFolderId: currentFolderId });
      setItems((prev) => [...prev, fileItem]);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    if (!e.dataTransfer.files) return;
    setUploading(true);
    for (const file of Array.from(e.dataTransfer.files)) {
      if (accept && !file.type.match(accept.replace('*', '.*'))) {
        continue;
      }
      const url = await upload(file);
      const fileItem = await onCreateFile({ name: file.name, url, parentFolderId: currentFolderId });
      setItems((prev) => [...prev, fileItem]);
    }
    setUploading(false);
  };

  const handleFileClick = (file: FileItem) => {
    setSelectedItem(file);
  };
  const handleFolderClick = (folder: FolderItem) => {
    setCurrentFolderId(folder.id);
    setBreadcrumbs((prev: FolderItem[]) => [...prev, folder]);
    setSelectedItem(folder);
  };
  const handleSelect = () => {
    if (selectedItem && isFile(selectedItem)) {
      onSelect(selectedItem.url);
      handleClose();
    }
  };
  const handleDeleteSelected = async () => {
    if (!selectedItem) return;
    if (isFile(selectedItem)) {
      await handleDeleteFile(selectedItem);
      setSelectedItem(null);
    } else if (isFolder(selectedItem)) {
      await handleDeleteFolder(selectedItem);
      setSelectedItem(null);
    }
  };

  // Responsive modal width and preview width
  const widthModal = Math.round(windowWidth * 0.8);
  const widthPreview = Math.round(widthModal * 0.6);

  if (!visible) return null;

  return (
    <Modal
      open={visible}
      title={
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <span>{title}</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0, marginRight: 40, marginTop: -10 }}>
            {/* Close button is handled by antd Modal, so just stack the toggle below */}
            <button
              onClick={() => setViewMode(viewMode === 'thumbnail' ? 'list' : 'thumbnail')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginTop: 8,
                fontSize: 22,
                color: '#222',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s',
              }}
              title={viewMode === 'thumbnail' ? 'List view' : 'Thumbnail view'}
            >
              {viewMode === 'thumbnail' ? <BarsOutlined /> : <AppstoreOutlined />}
            </button>
          </div>
        </div>
      }
      onCancel={handleClose}
      footer={null}
      width={widthModal}
      styles={{ body: { padding: 0 } }}
      destroyOnHidden
      mask={{ closable: false }}
      centered
    >
      <div className="simple-image-asset-manager-modal" style={{ padding: 24 }}>

        <div className="modal-body" style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            {/* Breadcrumbs + New Folder Icon */}
            <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <span
                  className="breadcrumb"
                  onClick={() => handleBreadcrumbClick(-1)}
                  style={{ cursor: 'pointer', color: '#1890ff', textDecoration: 'underline', fontWeight: 500, maxWidth: 120, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >All</span>
                {breadcrumbs.map((folder: FolderItem, idx: number) => {
                  const isLast = idx === breadcrumbs.length - 1;
                  return (
                    <span key={folder.id} style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ margin: '0 4px', fontWeight: 500 }}>/</span>
                      {isLast ? (
                        <span
                          className="breadcrumb"
                          style={{ color: '#222', fontWeight: 500, maxWidth: 120, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >{folder.name}</span>
                      ) : (
                        <span
                          className="breadcrumb"
                          onClick={() => handleBreadcrumbClick(idx)}
                          style={{ cursor: 'pointer', color: '#1890ff', textDecoration: 'underline', fontWeight: 500, maxWidth: 120, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >{folder.name}</span>
                      )}
                    </span>
                  );
                })}
              </div>
              {addFolderEnabled && !creatingFolder && (
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    userSelect: 'none',
                    fontWeight: 500,
                    fontSize: 15,
                    padding: '8px 20px',
                    borderRadius: 4,
                    background: '#1890ff',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(24,144,255,0.12)',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                  onClick={() => setCreatingFolder(true)}
                >
                  <span>New folder</span>
                  <FolderAddOutlined style={{ fontSize: 20 }} />
                </button>
              )}
            </div>
            {/* Drop area at the top */}
            <div
              className={`drop-area${isDragActive ? ' drag-active' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              style={{
                border: isDragActive ? '2px solid #1890ff' : '2px dashed #aaa',
                borderRadius: 8,
                padding: 32,
                marginBottom: 24,
                textAlign: 'center',
                background: isDragActive ? '#e6f7ff' : '#fafafa',
                position: 'relative',
                transition: 'border-color 0.3s, background 0.3s',
              }}
            >
              <div style={{
                marginBottom: 8,
                fontWeight: 500,
              }}>{isDragActive ? 'Drop file here to upload' : 'Drag & drop files here'}</div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  marginBottom: 8,
                  visibility: isDragActive ? 'hidden' : 'visible',
                  padding: '8px 24px',
                  borderRadius: 4,
                  background: uploading ? '#ccc' : '#1890ff',
                  color: '#fff',
                  border: 'none',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  fontWeight: 500,
                  fontSize: 15,
                  boxShadow: uploading ? 'none' : '0 2px 8px rgba(24,144,255,0.12)',
                  transition: 'background 0.2s, box-shadow 0.2s',
                }}
              >
                Upload
              </button>
              <input ref={fileInputRef} type="file" accept={accept} style={{ display: 'none' }} multiple
                     onChange={handleFileInputChange} />
              {uploading && <div>Uploading...</div>}
            </div>

            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <div>
                {/* Create folder input */}
                {addFolderEnabled && creatingFolder && (
                  <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      value={newFolderName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFolderName(e.target.value)}
                      placeholder="Folder name"
                      style={{
                        padding: '8px 12px',
                        borderRadius: 4,
                        border: '1px solid #d9d9d9',
                        fontSize: 15,
                        fontWeight: 500,
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = '#1890ff'}
                      onBlur={e => e.target.style.borderColor = '#d9d9d9'}
                    />
                    <button
                      onClick={handleCreateFolder}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 4,
                        background: '#1890ff',
                        color: '#fff',
                        border: 'none',
                        fontWeight: 500,
                        fontSize: 15,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(24,144,255,0.12)',
                        transition: 'background 0.2s',
                      }}
                    >Create</button>
                    <button
                      onClick={() => setCreatingFolder(false)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 4,
                        background: '#f5f5f5',
                        color: '#222',
                        border: '1px solid #d9d9d9',
                        fontWeight: 500,
                        fontSize: 15,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                    >Cancel</button>
                  </div>
                )}
                {/* Folders */}
                {viewMode === 'thumbnail' ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                    {items.filter(isFolder).map((folder: FolderItem) => (
                      <div
                        key={folder.id}
                        className="folder-item"
                        style={{
                          cursor: 'pointer',
                          width: 120,
                          minWidth: 120,
                          maxWidth: 120,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: 8,
                          borderRadius: 8,
                          background: '#fafafa',
                          boxSizing: 'border-box',
                        }}
                        onClick={() => handleFolderClick(folder)}
                      >
                        {folder.thumbnail ? (
                          <img
                            src={folder.thumbnail}
                            alt={folder.name}
                            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 4, marginBottom: 8, background: '#fff' }}
                          />
                        ) : (
                          <div style={{ fontSize: 40, width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, background: '#fff', borderRadius: 4 }}>📁</div>
                        )}
                        <div style={{
                          fontSize: 13,
                          fontWeight: 500,
                          width: '100%',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>{folder.name}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'block', marginBottom: 16 }}>
                    {items.filter(isFolder).map((folder: FolderItem) => (
                      <div
                        key={folder.id}
                        className="folder-item"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '8px 0',
                          borderBottom: '1px solid #f0f0f0',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleFolderClick(folder)}
                      >
                        {folder.thumbnail ? (
                          <img
                            src={folder.thumbnail}
                            alt={folder.name}
                            style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, background: '#fff' }}
                          />
                        ) : (
                          <div style={{ fontSize: 24, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 4 }}>📁</div>
                        )}
                        <div style={{
                          fontSize: 14,
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          flex: 1,
                        }}>{folder.name}</div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Files */}
                {viewMode === 'thumbnail' ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
                    {items.filter(isFile).map((file: FileItem) => {
                      const isSelected = selectedItem && isFile(selectedItem) && selectedItem.id === file.id;
                      return (
                        <div
                          key={file.id}
                          className="file-item"
                          style={{
                            cursor: 'pointer',
                            width: 120,
                            minWidth: 120,
                            maxWidth: 120,
                            border: '2px solid ' + (isSelected ? '#1890ff' : 'transparent'),
                            background: isSelected ? '#e6f7ff' : '#fafafa',
                            borderRadius: 8,
                            boxSizing: 'border-box',
                            transition: 'border-color 0.2s, background 0.2s',
                            padding: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                          onClick={() => handleFileClick(file)}
                        >
                          <img
                            src={file.thumbnail || file.url}
                            alt={file.name}
                            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 4, background: '#fff', marginBottom: 8 }}
                          />
                          <div style={{
                            fontSize: 12,
                            fontWeight: 500,
                            width: '100%',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginTop: 4,
                          }}>{file.name}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'block', marginTop: 16 }}>
                    {items.filter(isFile).map((file: FileItem) => {
                      const isSelected = selectedItem && isFile(selectedItem) && selectedItem.id === file.id;
                      return (
                        <div
                          key={file.id}
                          className="file-item"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '8px 0',
                            borderBottom: '1px solid #f0f0f0',
                            cursor: 'pointer',
                            background: isSelected ? '#e6f7ff' : '#fff',
                          }}
                          onClick={() => handleFileClick(file)}
                        >
                          <img
                            src={file.thumbnail || file.url}
                            alt={file.name}
                            style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, background: '#fff' }}
                          />
                          <div style={{
                            fontSize: 14,
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            flex: 1,
                          }}>{file.name}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Preview tab */}
          {selectedItem && (
            <div style={{ width: widthPreview, minWidth: 320, transition: 'width 2s', overflow: 'hidden' }}>
              <div style={{
                border: '1px solid #eee',
                borderRadius: 8,
                padding: 16,
                background: '#fff',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
              }}>
                <button
                  onClick={() => setSelectedItem(null)}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: '#f5f5f5',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 12px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: 14,
                    color: '#222',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  }}
                >Hide</button>
                {isFile(selectedItem) ? (
                  <>
                    <img src={selectedItem.thumbnail || selectedItem.url} alt={selectedItem.name} style={{ width: '100%', maxHeight: 240, objectFit: 'contain', borderRadius: 4, marginBottom: 16 }} />
                    <div style={{ fontWeight: 500, marginBottom: 8 }}>{selectedItem.name}</div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                      {selectedItem.url.startsWith('data:')
                        ? 'URL: data-uri'
                        : (
                            <>
                              URL: <a href={selectedItem.url} target="_blank" rel="noopener noreferrer">{selectedItem.url}</a>
                            </>
                          )}
                    </div>
                    <button
                      onClick={handleDeleteSelected}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        color: '#ff4d4f', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 15, marginTop: 24
                      }}
                    >
                      <DeleteOutlined /> Delete
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>📁</div>
                    <div style={{ fontWeight: 500, marginBottom: 8 }}>{selectedItem.name}</div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                      {`Files: ${items.filter(i => isFile(i) && (i.parentFolderId === selectedItem.id)).length}`}
                    </div>
                    <button
                      onClick={handleDeleteSelected}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        color: '#ff4d4f', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 15, marginTop: 24
                      }}
                    >
                      <DeleteOutlined /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer"
             style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 24 }}>
          <button
            onClick={handleSelect}
            disabled={!(selectedItem && isFile(selectedItem))}
            style={{
              padding: '8px 24px',
              borderRadius: 4,
              background: selectedItem && isFile(selectedItem) ? '#1890ff' : '#ccc',
              color: '#fff',
              border: 'none',
              cursor: selectedItem && isFile(selectedItem) ? 'pointer' : 'not-allowed',
              fontWeight: 500,
            }}
          >
            Select
          </button>
        </div>
        {/* Image editing modal would go here (using cropperjs) */}
      </div>
    </Modal>
  );
};
