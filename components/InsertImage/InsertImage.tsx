import UploadImage, {
  IUploadImageProps,
} from "@/components/UploadImage/UploadImage";

export function InsertImage({
  onUploadSuccess,
  onStateChange,
}: IInsertImageProps) {
  return (
    <div>
      <UploadImage
        onUploadSuccess={onUploadSuccess}
        onStateChange={onStateChange}
      />
    </div>
  );
}

export type IInsertImageProps = IUploadImageProps;

export default InsertImage;
