import UploadImage, {
  IUploadImageProps,
} from '@/components/UploadImage/UploadImage';

export function InsertImage({
  onUploadSuccess,
  onStateChange,
  isDisplayURLUpload = true,
}: IInsertImageProps) {
  return (
    <div>
      <UploadImage
        onUploadSuccess={onUploadSuccess}
        onStateChange={onStateChange}
        isDisplayURLUpload={isDisplayURLUpload}
      />
    </div>
  );
}

export type IInsertImageProps = IUploadImageProps;

export default InsertImage;
