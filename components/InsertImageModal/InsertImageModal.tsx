import InsertImage, {
  IInsertImageProps,
} from "@/components/InsertImage/InsertImage";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from "@fluentui/react-components";
import { DialogOpenChangeEventHandler } from "@fluentui/react-dialog";

export function InsertImageModal(props: IInsertImageModalProps) {
  return (
    <Dialog defaultOpen onOpenChange={props.onOpenChange}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogContent>
            <InsertImage onUploadSuccess={props.onUploadSuccess} />
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export interface IInsertImageModalProps extends IInsertImageProps {
  onOpenChange?: DialogOpenChangeEventHandler;
}
export default InsertImageModal;
