export interface CustomImageOverlay {
  id: string;
  name: string;
  fileName: string;
  path: string;
  uploadedAt: string;
  size: number;
  type: string;
}

export type UploadStatus = 'idle' | 'success' | 'error';
