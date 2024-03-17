import useSlidesStore from "@/src/stores/store";
import { getApiServer, s3RandomPublicKey } from "@/src/helpers";
import { ServerClient } from "@/src/apis/server.client";
import { UploadStatus } from "@/src/types/common.types";

export function UploadImage({
  onUploadSuccess,
  onStateChange,
}: IUploadImageProps) {
  let key = "";
  const uploadImage = (e: any) => {
    const file = e.target.files[0];
    // TODO: make this component to allow private uploads as well. we need to change upload folder location make it private
    // TODO: Add a loading spinner
    // TODO: Add error handling
    // TODO: Close modal on success
    onStateChange && onStateChange("uploading");
    const apiServer = getApiServer();
    ServerClient.uploadS3Object(
      apiServer,
      s3RandomPublicKey(),
      file,
      true,
    ).then((resp) => {
      console.log(resp);
      onStateChange && onStateChange("uploaded");
      onUploadSuccess(resp.publicUrl);
    });
  };

  return (
    <div>
      <input type="file" onChange={uploadImage} />
    </div>
  );
}

export interface IUploadImageProps {
  onUploadSuccess: (url?: string) => void;
  onStateChange?: (status: UploadStatus) => void;
}
export default UploadImage;
