import UploadImage, {
  IUploadImageProps,
} from "@/components/UploadImage/UploadImage";

export function InsertImage(props: IInsertImageProps) {
  // TODO: This component should be improved to allow other public image sources

  return (
    <div>
      <UploadImage onUploadSuccess={props.onUploadSuccess} />
    </div>
  );
}

export type IInsertImageProps = IUploadImageProps;

export default InsertImage;
