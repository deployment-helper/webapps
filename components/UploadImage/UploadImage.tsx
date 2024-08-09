import { useDropzone } from 'react-dropzone';
import { getApiServer, getFileType, s3RandomPublicKey } from '@/src/helpers';
import { ServerClient } from '@/src/apis/server.client';
import { UploadStatus } from '@/src/types/common.types';
import { Button, Input, Spinner } from '@fluentui/react-components';
import { useMemo, useRef, useState } from 'react';
import { useMyToastController } from '@/components/MyToast';

export function UploadImage({
  onUploadSuccess,
  onStateChange,
  isDisplayURLUpload = true,
}: IUploadImageProps) {
  const onDrop = (acceptedFiles: File[]) => {
    uploadImage(acceptedFiles[0]);
  };

  // TODO: make this component to allow private uploads as well. we need to change upload folder location make it private
  // TODO: Add a loading spinner
  // TODO: Add error handling
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { dispatchToast } = useMyToastController();
  const uploadImage = (file: File) => {
    onStateChange && onStateChange('uploading');
    setIsUploading(true);
    const apiServer = getApiServer();
    const s3Key = s3RandomPublicKey();
    const fileType = getFileType(file);

    ServerClient.uploadS3Object(
      apiServer,
      `${s3Key}.${fileType.extension}`,
      file,
      true,
    ).then((resp) => {
      onStateChange && onStateChange('uploaded');
      setIsUploading(false);
      onUploadSuccess(resp.publicUrl);
    });
  };

  // Upload image from URL

  const uploadImageFromUrl = () => {
    const url = inputRef.current?.value;
    if (!url) {
      dispatchToast({
        title: 'Error',
        body: 'Please enter a valid URL',
        intent: 'error',
      });
    } else {
      onUploadSuccess(url);
    }
  };

  const isDisabled = useMemo(() => {
    return !inputRef?.current?.value?.length;
  }, [inputRef?.current?.value]);

  return (
    <>
      <div
        {...getRootProps()}
        className={` flex h-full w-full items-center justify-center ${
          isDragActive ? 'bg-gray-100' : 'bg-white'
        }`}
        style={{
          border: '2px dashed gray',
          padding: '20px',
          textAlign: 'center',
          borderRadius: '10px',
          height: '150px',
        }}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <Spinner size={'medium'} />
        ) : (
          <p>Drag and drop some files here, or click to select files</p>
        )}
      </div>
      {isDisplayURLUpload && (
        <>
          {/*  Crate a horizontal line*/}
          <div className="my-4 border-t border-gray-400"></div>
          <div className={'flex gap-2'}>
            <Input
              ref={inputRef}
              placeholder={'Type already uploaded asset URL.'}
              className={'w-full'}
            />
            <Button appearance={'primary'} onClick={uploadImageFromUrl}>
              Upload
            </Button>
          </div>
        </>
      )}
    </>
  );
}

export interface IUploadImageProps {
  onUploadSuccess: (url?: string) => void;
  onStateChange?: (status: UploadStatus) => void;
  isDisplayURLUpload?: boolean;
}

export default UploadImage;
