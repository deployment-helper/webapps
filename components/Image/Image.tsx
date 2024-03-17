import { useState } from "react";
import { InsertImageModal } from "@/components/InsertImageModal/InsertImageModal";
import { IInsertImageProps } from "@/components/InsertImage/InsertImage";

export function Image({ isViewOnly, onUploadSuccess, src }: IImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onOpenChange = (e: any, data: any) => {
    setIsModalOpen(data.open);
  };

  return (
    <>
      <div
        className={`relative h-48 w-48  bg-contain bg-center`}
        style={{ backgroundImage: `url(${src})` }}
      >
        {!isViewOnly && (
          // Replace button at right top
          <button
            className={"absolute right-0 top-0 bg-amber-200"}
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            Replace
          </button>
        )}
      </div>
      {isModalOpen && (
        <InsertImageModal
          onUploadSuccess={onUploadSuccess}
          onOpenChange={onOpenChange}
        />
      )}
    </>
  );
}

export interface IImageProps extends IInsertImageProps {
  isViewOnly?: boolean;
  src?: string;
}
export default Image;
