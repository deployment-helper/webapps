import InsertImage, {
  IInsertImageProps,
} from "@/components/InsertImage/InsertImage";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Spinner,
} from "@fluentui/react-components";
import { DialogOpenChangeEventHandler } from "@fluentui/react-dialog";
import { UploadStatus } from "@/src/types/common.types";
import { useState } from "react";

export function InsertImageModal({
  onUploadSuccess,
  onOpenChange,
}: IInsertImageModalProps) {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");

  const onUploadStatusChange = (status: UploadStatus) => {
    setUploadStatus(status);
  };
  return (
    <Dialog defaultOpen onOpenChange={onOpenChange}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogContent className={"flex p-3"} style={{ height: "100px" }}>
            <InsertImage
              onUploadSuccess={onUploadSuccess}
              onStateChange={onUploadStatusChange}
            />
            <div>
              {uploadStatus === "uploading" && <Spinner size={"medium"} />}
            </div>
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
