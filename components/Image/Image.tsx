import { SyntheticEvent, useEffect, useState } from 'react';
import { InsertImageModal } from '@/components/InsertImageModal/InsertImageModal';
import { IInsertImageProps } from '@/components/InsertImage/InsertImage';
import { ArrowSync24Filled } from '@fluentui/react-icons';
import CopyIcon, { ICopyIconProps } from '@/components/CopyIcon/CopyIcon';
import DeleteIcon from '@/components/DeleteIcon/DeleteIcon';
import ImageSparkle from '@/components/ImageSparkle/ImageSparkle';
import { IClearError } from '@/src/types/common.types';

export function Image({
  alt,
  copyPosition,
  isAIImage,
  isCopyable,
  isViewOnly,
  onDelete,
  onError,
  onLoad,
  onUploadSuccess,
  src,
}: IImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onOpenChange = (e: any, data: any) => {
    setIsModalOpen(data.open);
  };

  const onSuccessfulUpload = (url: string) => {
    setIsModalOpen(false);
    onUploadSuccess && onUploadSuccess(url);
  };

  const onImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    onError && onError('Image not found');
  };

  const onImageLoadSuccess = () => {
    onLoad && onLoad();
  };

  return (
    // TODO: This component can be improved by adding a loading state when uploading an image.
    // TODO: className relative can be moved to the parent div
    <>
      {isViewOnly ? (
        <div className={'relative'}>
          {isCopyable && (
            <CopyIcon position={copyPosition || 'top-right'} copyText={src} />
          )}
          {onDelete && <DeleteIcon onClick={onDelete} />}
          <img
            loading="lazy"
            src={src}
            onError={onImageError}
            onLoad={onImageLoadSuccess}
            alt={alt}
          />
        </div>
      ) : (
        <div className={`relative`}>
          <img
            loading="lazy"
            src={src}
            onError={onImageError}
            onLoad={onImageLoadSuccess}
            alt={alt}
          />
          {isCopyable && <CopyIcon position={'top-right'} copyText={src} />}
          {!isViewOnly && (
            // Replace button at right top
            <div
              className={
                'absolute bottom-1 right-1 cursor-pointer rounded bg-violet-100'
              }
              onClick={() => setIsModalOpen(!isModalOpen)}
            >
              <ArrowSync24Filled />
            </div>
          )}
          {isAIImage && <ImageSparkle onSubmit={onUploadSuccess} />}
        </div>
      )}

      {isModalOpen && (
        <InsertImageModal
          // @ts-ignore
          onUploadSuccess={onSuccessfulUpload}
          onOpenChange={onOpenChange}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export interface IImageProps extends Partial<IInsertImageProps> {
  alt?: string;
  copyPosition?: ICopyIconProps['position'];
  isAIImage?: boolean;
  isCopyable?: boolean;
  isViewOnly?: boolean;
  onDelete?: () => void;
  onError?: (error: string) => void;
  onLoad?: () => void;
  onUploadSuccess?: (url: string) => void;
  src: string;
}

export default Image;
