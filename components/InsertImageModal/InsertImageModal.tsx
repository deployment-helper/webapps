import InsertImage, {
  IInsertImageProps,
} from '@/components/InsertImage/InsertImage';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Subtitle1,
} from '@fluentui/react-components';
import { DialogOpenChangeEventHandler } from '@fluentui/react-dialog';
import { UploadStatus } from '@/src/types/common.types';
import { useState } from 'react';
import { DismissCircle24Filled } from '@fluentui/react-icons';

export function InsertImageModal({
  onUploadSuccess,
  onOpenChange,
  onClose,
  title,
  isOpen = false,
  isDisplayURLUpload = true,
}: IInsertImageModalProps) {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');

  const onUploadStatusChange = (status: UploadStatus) => {
    setUploadStatus(status);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>
            <div className={'flex justify-between'}>
              <Subtitle1>{title ? title : 'Select Object'}</Subtitle1>
              <div
                className={
                  'relative -right-4 -top-4 cursor-pointer text-gray-600'
                }
                onClick={onClose}
              >
                <DismissCircle24Filled />
              </div>
            </div>
          </DialogTitle>
          <DialogContent className={'block'} style={{ height: '350px' }}>
            <InsertImage
              onUploadSuccess={onUploadSuccess}
              onStateChange={onUploadStatusChange}
              isDisplayURLUpload={isDisplayURLUpload}
            />
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export interface IInsertImageModalProps extends IInsertImageProps {
  onOpenChange?: DialogOpenChangeEventHandler;
  onClose?: () => void;
  isOpen?: boolean;
  title?: string;
}

export default InsertImageModal;
