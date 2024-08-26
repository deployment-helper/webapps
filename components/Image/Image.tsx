import { useState } from 'react';
import { InsertImageModal } from '@/components/InsertImageModal/InsertImageModal';
import { IInsertImageProps } from '@/components/InsertImage/InsertImage';
import { ArrowSync24Filled, Delete20Filled } from '@fluentui/react-icons';
import CopyIcon from '@/components/CopyIcon/CopyIcon';
import DeleteIcon from '@/components/DeleteIcon/DeleteIcon';

export function Image({
  isViewOnly,
  onUploadSuccess,
  onDelete,
  src,
  isCopyable,
}: IImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onOpenChange = (e: any, data: any) => {
    setIsModalOpen(data.open);
  };

  const onSuccessfulUpload = (url: string) => {
    setIsModalOpen(false);
    onUploadSuccess && onUploadSuccess(url);
  };

  return (
    <>
      {isViewOnly ? (
        <div className={'relative'}>
          {isCopyable && <CopyIcon position={'top-right'} copyText={src} />}
          {onDelete && <DeleteIcon onClick={onDelete} />}
          <img src={src} />
        </div>
      ) : (
        <div className={`relative`}>
          <img src={src} />
          {isCopyable && <CopyIcon position={'top-right'} copyText={src} />}
          {!isViewOnly && (
            // Replace button at right top
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
  onDelete?: () => void;
}

export default Image;
