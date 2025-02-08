import { SyntheticEvent, useState } from 'react';
import { InsertImageModal } from '@/components/InsertImageModal/InsertImageModal';
import { IInsertImageProps } from '@/components/InsertImage/InsertImage';
import { ArrowSync24Filled } from '@fluentui/react-icons';
import CopyIcon, { ICopyIconProps } from '@/components/CopyIcon/CopyIcon';
import DeleteIcon from '@/components/DeleteIcon/DeleteIcon';
import ImageSparkle from '@/components/ImageSparkle/ImageSparkle';

export function Image({
  isAIImage,
  isViewOnly,
  onUploadSuccess,
  onDelete,
  onError,
  src,
  isCopyable,
  copyPosition,
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
          <img src={src} onError={onImageError} />
        </div>
      ) : (
        <div className={`relative`}>
          <img src={src} onError={onImageError} />
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
  isViewOnly?: boolean;
  src: string;
  isCopyable?: boolean;
  copyPosition?: ICopyIconProps['position'];
  onDelete?: () => void;
  isAIImage?: boolean;
  alt?: string;
  onError?: (error: string) => void;
}

export default Image;
