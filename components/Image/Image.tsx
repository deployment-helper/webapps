import { useState } from 'react';
import { InsertImageModal } from '@/components/InsertImageModal/InsertImageModal';
import { IInsertImageProps } from '@/components/InsertImage/InsertImage';
import { ArrowSync24Filled } from '@fluentui/react-icons';
import CopyIcon from '@/components/CopyIcon/CopyIcon';

export function Image({
  isViewOnly,
  onUploadSuccess,
  src,
  isCopyable,
}: IImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onOpenChange = (e: any, data: any) => {
    setIsModalOpen(data.open);
  };

  return (
    <>
      {isViewOnly ? (
        <div className={'relative'}>
          {isCopyable && <CopyIcon position={'top-right'} copyText={src} />}
          <img src={src} />
        </div>
      ) : (
        <div
          className={`relative h-48 w-48  bg-contain bg-center`}
          style={{ backgroundImage: `url(${src})` }}
        >
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
          onUploadSuccess={onUploadSuccess}
          onOpenChange={onOpenChange}
        />
      )}
    </>
  );
}

export interface IImageProps extends Partial<IInsertImageProps> {
  isViewOnly?: boolean;
  src: string;
  isCopyable?: boolean;
}

export default Image;
