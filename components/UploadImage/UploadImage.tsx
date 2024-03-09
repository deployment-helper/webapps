import useSlidesStore from "@/src/stores/store";
import { s3RandomPublicKey } from "@/src/helpers";

export function UploadImage(props: IUploadImageProps) {
  const { uploadS3Object } = useSlidesStore();
  const s3PublicUrls = useSlidesStore((store) => store.s3PublicUrls);

  let key = "";
  const uploadImage = (e: any) => {
    const file = e.target.files[0];
    // TODO: make this component to allow private uploads as well. we need to change upload folder location make it private
    // TODO: Add a loading spinner
    // TODO: Add error handling
    // TODO: Close modal on success
    key = s3RandomPublicKey();
    uploadS3Object(file, key, true).then(() => {
      console.log(s3PublicUrls?.[key]);
      props.onUploadSuccess(s3PublicUrls?.[key]);
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
}
export default UploadImage;
