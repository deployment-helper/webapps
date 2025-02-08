import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from '@fluentui/react-components';

interface DialogProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit?: () => void;
  submitButtonText?: string;
  closeButtonText?: string;
}

export const ReusableDialog: React.FC<DialogProps> = ({
  open,
  title,
  children,
  onClose,
  onSubmit,
  submitButtonText = 'Submit',
  closeButtonText = 'Close',
}) => {
  return (
    <Dialog open={open}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{children}</DialogContent>

          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {closeButtonText}
            </Button>
            {onSubmit && (
              <Button appearance="primary" onClick={onSubmit}>
                {submitButtonText}
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default ReusableDialog;
