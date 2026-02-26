export interface FileItem {
  id: string;
  url: string;
  type: "FILE";
  name: string;
  parentFolderId: string | null;
  thumbnail?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  type: "FOLDER";
  parentFolderId: string | null;
  thumbnail?: string;
  count?: number;
}

export interface AssetManagerProps {
  accept?: string;
  request: (folderId?: string) => Promise<Array<FileItem | FolderItem>>;
  title?: string;
  upload: (blob: Blob) => Promise<string>;
  onCreateFile: (params: { name: string; url: string; parentFolderId: string | null }) => Promise<FileItem>;
  onDeleteFile: (params: { id: string }) => Promise<boolean>;
  onDeleteFolder: (params: { id: string }) => Promise<boolean>;
  onUpdateFile: (item: FileItem) => Promise<FileItem>;
  onUpdateFolder: (item: FolderItem) => Promise<FolderItem>;
  onCreateFolder: (params: { name: string; parentFolderId: string | null }) => Promise<FolderItem>;
  onSelect: (url: string) => void;
  visible?: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  showUnacceptedFile?: boolean;
  addFolderEnabled?: boolean;
}

