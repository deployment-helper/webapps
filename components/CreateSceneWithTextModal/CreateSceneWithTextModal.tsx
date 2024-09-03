import { useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Subtitle1,
  Textarea,
} from '@fluentui/react-components';
import { DismissCircle24Filled } from '@fluentui/react-icons';

export function CreateSceneWithTextModal({
  isOpen,
  onClose,
  onSceneCreate,
}: ICreateSceneWithTextModalProps) {
  const refTextarea = useRef<HTMLTextAreaElement>(null);
  const onCreateScene = () => {
    const text = refTextarea.current?.value;
    onSceneCreate(text || '');
    onClose?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>
            <div className={'flex justify-between'}>
              <Subtitle1>{'Create Scene With Text'}</Subtitle1>
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
            <div className={'flex flex-col gap-4'}>
              <Textarea rows={20} ref={refTextarea} />
              <Button appearance={'primary'} onClick={onCreateScene}>
                Create
              </Button>
            </div>
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export interface ICreateSceneWithTextModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSceneCreate: (scene: string) => void;
}
