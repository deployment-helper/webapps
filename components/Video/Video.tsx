import CopyIcon from '@/components/CopyIcon/CopyIcon';
import { IInsertImageProps } from '@/components/InsertImage/InsertImage';
import { ArrowSync24Filled } from '@fluentui/react-icons';
import { useState } from 'react';
import InsertImageModal from '@/components/InsertImageModal/InsertImageModal';

export function Video({
  src,
  isCopyable,
  isViewOnly,
  onUploadSuccess,
}: IVideoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onSuccessfulUpload = (url: string) => {
    setIsModalOpen(false);
    onUploadSuccess && onUploadSuccess(url);
  };
  
  return (
    <>
      <div className={'relative'}>
        {isCopyable && <CopyIcon position={'top-right'} copyText={src} />}
        <video src={src} />
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
        />
      )}
    </>
  );
}

export interface IVideoProps extends Partial<IInsertImageProps> {
  isViewOnly?: boolean;
  src: string;
  isCopyable?: boolean;
}
