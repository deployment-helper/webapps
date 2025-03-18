export type UploadStatus = 'uploading' | 'uploaded' | 'error' | 'idle';

export type IError = (id: string, error: string) => void;

export type IClearError = (id: string) => void;
