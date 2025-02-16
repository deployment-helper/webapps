import CopyIcon, { ICopyIconProps } from '@/components/CopyIcon/CopyIcon';
import { IInsertImageProps } from '@/components/InsertImage/InsertImage';
import { ArrowSync24Filled } from '@fluentui/react-icons';
import { SyntheticEvent, useState } from 'react';
import InsertImageModal from '@/components/InsertImageModal/InsertImageModal';
import DeleteIcon from '@/components/DeleteIcon/DeleteIcon';

export function Video({
  src,
  isCopyable,
  copyPosition,
  isViewOnly,
  onUploadSuccess,
  onDelete,
  onError,
}: IVideoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onSuccessfulUpload = (url: string) => {
    setIsModalOpen(false);
    onUploadSuccess && onUploadSuccess(url);
  };

  const onVideoError = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
    onError && onError('Video not found');
  };
  return (
    <>
      <div className={'relative'}>
        <video controls src={src} onError={onVideoError} />
        {isCopyable && (
          <CopyIcon position={copyPosition || 'top-right'} copyText={src} />
        )}
        {onDelete && <DeleteIcon onClick={onDelete} />}
        {!isViewOnly && (
          <div
            className={
              'absolute bottom-1 right-1 cursor-pointer rounded bg-amber-200'
            }
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            <ArrowSync24Filled />
          </div>
        )}
      </div>
      {isModalOpen && (
        <InsertImageModal
          // @ts-ignore
          onUploadSuccess={onSuccessfulUpload}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export interface IVideoProps extends Partial<IInsertImageProps> {
  isViewOnly?: boolean;
  src: string;
  isCopyable?: boolean;
  copyPosition?: ICopyIconProps['position'];
  onDelete?: () => void;
  onError?: (error: string) => void;
}
