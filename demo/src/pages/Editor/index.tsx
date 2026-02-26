import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import template from '@demo/store/template';
import { useAppSelector } from '@demo/hooks/useAppSelector';
import { useLoading } from '@demo/hooks/useLoading';
import { App, ConfigProvider } from 'antd';
import { useQuery } from '@demo/hooks/useQuery';
import { useHistory } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { Loading } from '@demo/components/loading';
import mjml from 'mjml-browser';
import services from '@demo/services';
import { saveAs } from 'file-saver';
import { EmailEditor, EmailEditorProvider, IEmailTemplate } from 'easy-email-editor';
import { pushEvent } from '@demo/utils/pushEvent';
import { UserStorage } from '@demo/utils/user-storage';

import { AdvancedType, IBlockData, JsonToMjml } from 'easy-email-core';
import { ExtensionProps, SimpleLayout } from 'easy-email-extensions';

import 'easy-email-editor/lib/style.css';
import 'easy-email-extensions/lib/style.css';
import blueTheme from '@arco-themes/react-easy-email-theme/css/arco.css?inline';

import enUS from 'antd/locale/en_US';

import { useShowCommercialEditor } from '@demo/hooks/useShowCommercialEditor';
import { useWindowSize } from 'react-use';
import { AutoSaveAndRestoreEmail } from '@demo/components/AutoSaveAndRestoreEmail';
import { AssetManager, FileItem, FolderItem } from 'simple-image-asset-manager';

const LOCAL_STORAGE_KEY = 'asset_manager_demo_assets';

function loadAssets(): Array<FileItem | FolderItem> {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return [
    { id: 'cat-folder', name: 'Category', type: 'FOLDER', parentFolderId: null },
    {
      id: 'file-default-1',
      name: 'Default Image 1',
      url: 'https://cdn.jsdelivr.net/gh/thanhpv-102/easy-email-editor@master/demo/public/images/f69f48af-5b15-40aa-91c4-81d601d1357b-083dc99d-02a6-40d9-ae28-0662bd078b5d.png',
      type: 'FILE',
      parentFolderId: null,
      thumbnail: 'https://cdn.jsdelivr.net/gh/thanhpv-102/easy-email-editor@master/demo/public/images/f69f48af-5b15-40aa-91c4-81d601d1357b-083dc99d-02a6-40d9-ae28-0662bd078b5d.png',
    },
    {
      id: 'file-default-2',
      name: 'Default Image 2',
      url: 'https://cdn.jsdelivr.net/gh/thanhpv-102/easy-email-editor@master/demo/public/images/9cce6b16-5a98-4ddb-b1a1-6cec2cf56891-c3acb856-8ab8-4cfb-93f9-2a0747678b8b.png',
      type: 'FILE',
      parentFolderId: null,
      thumbnail: 'https://cdn.jsdelivr.net/gh/thanhpv-102/easy-email-editor@master/demo/public/images/9cce6b16-5a98-4ddb-b1a1-6cec2cf56891-c3acb856-8ab8-4cfb-93f9-2a0747678b8b.png',
    },
    {
      id: 'file-default-3',
      name: 'Default Image 3',
      url: 'https://cdn.jsdelivr.net/gh/thanhpv-102/easy-email-editor@master/demo/public/images/d9795c1d-fa32-4adb-ab25-30b7cfe87936-df21314f-6f05-4550-80b3-9ab1107e8fbe.png',
      type: 'FILE',
      parentFolderId: null,
      thumbnail: 'https://cdn.jsdelivr.net/gh/thanhpv-102/easy-email-editor@master/demo/public/images/d9795c1d-fa32-4adb-ab25-30b7cfe87936-df21314f-6f05-4550-80b3-9ab1107e8fbe.png',
    },
  ];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
function saveAssets(assets: Array<FileItem | FolderItem>) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(assets));
}

const defaultCategories: ExtensionProps['categories'] = [
  {
    label: 'Content',
    active: true,
    blocks: [
      {
        type: AdvancedType.TEXT,
      },
      {
        type: AdvancedType.IMAGE,
      },
      {
        type: AdvancedType.BUTTON,
      },
      {
        type: AdvancedType.SOCIAL,
      },
      {
        type: AdvancedType.DIVIDER,
      },
      {
        type: AdvancedType.SPACER,
      },
      {
        type: AdvancedType.HERO,
      },
      {
        type: AdvancedType.WRAPPER,
      },
      {
        type: AdvancedType.TABLE,
      },
    ],
  },
  {
    label: 'Layout',
    active: true,
    displayType: 'column',
    blocks: [
      {
        title: '2 columns',
        payload: [
          ['50%', '50%'],
          ['33%', '67%'],
          ['67%', '33%'],
          ['25%', '75%'],
          ['75%', '25%'],
        ],
      },
      {
        title: '3 columns',
        payload: [
          ['33.33%', '33.33%', '33.33%'],
          ['25%', '25%', '50%'],
          ['50%', '25%', '25%'],
        ],
      },
      {
        title: '4 columns',
        payload: [['25%', '25%', '25%', '25%']],
      },
    ],
  },
];

export default function Editor() {
  const { featureEnabled } = useShowCommercialEditor();
  const dispatch = useDispatch();
  const history = useHistory();
  const templateData = useAppSelector('template');
  const { width } = useWindowSize();
  const compact = width > 1600;
  const { id, userId } = useQuery();
  const loading = useLoading(template.loadings.fetchById);

  useEffect(() => {
    if (id) {
      if (!userId) {
        UserStorage.getAccount().then(account => {
          dispatch(template.actions.fetchById({ id: +id, userId: account.user_id }));
        });
      } else {
        dispatch(template.actions.fetchById({ id: +id, userId: +userId }));
      }
    } else {
      dispatch(template.actions.fetchDefaultTemplate(undefined));
    }

    return () => {
      dispatch(template.actions.set(null));
    };
  }, [dispatch, id, userId]);

  const onUploadImage = async (blob: Blob): Promise<string> => {
    const url = await uploadFile(blob)
    const file = await createFile({ name: 'uploaded' + Date.now(), url: url, parentFolderId: null })
    return file.url;
  };

  const onExportMJML = (values: IEmailTemplate) => {
    const mjmlString = JsonToMjml({
      data: values.content,
      mode: 'production',
      context: values.content,
    });

    pushEvent({ event: 'MJMLExport', payload: { values } });
    navigator.clipboard.writeText(mjmlString);
    saveAs(new Blob([mjmlString], { type: 'text/mjml' }), 'easy-email.mjml');
  };

  const onExportHTML = (values: IEmailTemplate) => {
    const mjmlString = JsonToMjml({
      data: values.content,
      mode: 'production',
      context: values.content,
    });

    const html = mjml(mjmlString, {}).html;

    pushEvent({ event: 'HTMLExport', payload: { values } });
    navigator.clipboard.writeText(html);
    saveAs(new Blob([html], { type: 'text/html' }), 'easy-email.html');
  };

  const onExportJSON = (values: IEmailTemplate) => {
    navigator.clipboard.writeText(JSON.stringify(values, null, 2));
    saveAs(
      new Blob([JSON.stringify(values, null, 2)], { type: 'application/json' }),
      'easy-email.json',
    );
  };

  const initialValues: IEmailTemplate | null = useMemo(() => {
    if (!templateData) return null;
    const sourceData = cloneDeep(templateData.content) as IBlockData;
    return {
      ...templateData,
      content: sourceData, // replace standard block
    };
  }, [templateData]);

  const onSubmit = useCallback(
    async (values: IEmailTemplate) => {
      console.log('onSubmit', values);
    },
    [dispatch, history, id, initialValues],
  );

  const [assetManagerVisible, setAssetManagerVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  // Promise resolver cho chọn ảnh từ AssetManager
  const [assetManagerPromise, setAssetManagerPromise] = useState<null | ((url: string) => void)>(null);

  // Hàm callback cho ImageUploader: mở AssetManager và trả về url khi chọn
  const onSelectAssetManager = useCallback(() => {
    setAssetManagerVisible(true);
    return new Promise<string>((resolve) => {
      setAssetManagerPromise(() => resolve);
    });
  }, []);

  // Khi chọn ảnh trong AssetManager
  const handleSelect = (url: string) => {
    setSelectedImageUrl(url);
    setAssetManagerVisible(false);
    if (assetManagerPromise) {
      assetManagerPromise(url);
      setAssetManagerPromise(null);
    }
  };

  // Fetch files and folders from your backend
  const fetchAssets = async (folderId?: string): Promise<Array<FileItem | FolderItem>> => {
    const assets = loadAssets();
    return assets.filter(item => item.parentFolderId === (folderId ?? null));
  };

  // Upload file to your backend
  const uploadFile = async (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  // Create file record in your database
  const createFile = async (params: {
    name: string;
    url: string;
    parentFolderId: string | null;
  }): Promise<FileItem> => {
    const assets = loadAssets();
    const file: FileItem = {
      id: 'file-' + Date.now() + Math.random(),
      name: params.name,
      url: params.url,
      type: 'FILE',
      parentFolderId: params.parentFolderId,
      thumbnail: params.url,
    };
    assets.push(file);
    saveAssets(assets);
    return file;
  };

  // Delete file
  const deleteFile = async (params: { id: string }): Promise<boolean> => {
    let assets = loadAssets();
    assets = assets.filter(item => !(item.type === 'FILE' && item.id === params.id));
    saveAssets(assets);
    return true;
  };

  // Delete folder
  const deleteFolder = async (params: { id: string }): Promise<boolean> => {
    let assets = loadAssets();
    // Remove folder and all its children recursively
    function removeFolderAndChildren(folderId: string) {
      assets = assets.filter(item => {
        if (item.type === 'FOLDER' && item.id === folderId) return false;
        if (item.parentFolderId === folderId) {
          if (item.type === 'FOLDER') removeFolderAndChildren(item.id);
          return false;
        }
        return true;
      });
    }
    removeFolderAndChildren(params.id);
    saveAssets(assets);
    return true;
  };

  // Update file
  const updateFile = async (item: FileItem): Promise<FileItem> => {
    const assets = loadAssets();
    const idx = assets.findIndex(a => a.type === 'FILE' && a.id === item.id);
    if (idx !== -1) assets[idx] = item;
    saveAssets(assets);
    return item;
  };

  // Update folder
  const updateFolder = async (item: FolderItem): Promise<FolderItem> => {
    const assets = loadAssets();
    const idx = assets.findIndex(a => a.type === 'FOLDER' && a.id === item.id);
    if (idx !== -1) assets[idx] = item;
    saveAssets(assets);
    return item;
  };

  // Create folder
  const createFolder = async (params: {
    name: string;
    parentFolderId: string | null;
  }): Promise<FolderItem> => {
    const assets = loadAssets();
    const folder: FolderItem = {
      id: 'folder-' + Date.now() + Math.random(),
      name: params.name,
      type: 'FOLDER',
      parentFolderId: params.parentFolderId,
    };
    assets.push(folder);
    saveAssets(assets);
    return folder;
  };

  if (!templateData && loading) {
    return (
      <Loading loading={loading}>
        <div style={{ height: '100vh' }} />
      </Loading>
    );
  }

  if (!initialValues) return null;

  return (
    <ConfigProvider locale={enUS}>
      <App>
        <div>
          <style>{blueTheme}</style>
          <EmailEditorProvider
            height={'calc(100vh - 1px)'}
            data={initialValues}
            onUploadImage={onUploadImage}
            onSubmit={onSubmit}
            dashed={false}
            compact={compact}
            mergeTags={{ user: { name: 'Test username', email: 'testmail@example.com' } }}
            enableAssetManager={true}
            toggleAssetManager={() => setAssetManagerVisible(true)}
            selectedAsset={selectedImageUrl ?? ""}
            onSelectAssetManager={onSelectAssetManager}
          >
            {({ values }, { submit, restart }) => {
              return (
                <>
                  <SimpleLayout>
                    <EmailEditor />
                    <AutoSaveAndRestoreEmail />
                  </SimpleLayout>
                </>
              );
            }}
          </EmailEditorProvider>

          <AssetManager
            accept="image/*"
            request={fetchAssets}
            upload={uploadFile}
            onCreateFile={createFile}
            onDeleteFile={deleteFile}
            onDeleteFolder={deleteFolder}
            onUpdateFile={updateFile}
            onUpdateFolder={updateFolder}
            onCreateFolder={createFolder}
            onSelect={handleSelect}
            visible={assetManagerVisible}
            setVisible={setAssetManagerVisible}
          />
        </div>
      </App>
    </ConfigProvider>
  );
}
