import React, { useState } from 'react';
import { ImageSparkle24Filled } from '@fluentui/react-icons';
import ImageList from '@/components/ImageList/ImageList';

export function SparkleImage({
  position = 'bottom-left',
  onSubmit,
}: ISparkleImageProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleApplyImage = (url: string) => {
    console.log('Selected Image:', url);
    setIsDrawerOpen(false);
    onSubmit && onSubmit(url);
  };

  let positionClass = '';
  switch (position) {
    case 'top-right':
      positionClass = 'absolute right-1 top-1';
      break;
    case 'top-left':
      positionClass = 'absolute left-1 top-1';
      break;
    case 'bottom-right':
      positionClass = 'absolute right-1 bottom-1';
      break;
    case 'bottom-left':
      positionClass = 'absolute left-1 bottom-1';
      break;
    default:
      positionClass = 'absolute left-1 bottom-1';
  }

  return (
    <div
      className={`${positionClass} z-10 cursor-pointer rounded bg-violet-100`}
    >
      <ImageSparkle24Filled onClick={handleOpenDrawer} />
      {isDrawerOpen && (
        <ImageList
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          title="Select an Image"
          onApply={handleApplyImage}
        />
      )}
    </div>
  );
}

export interface ISparkleImageProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onSubmit?: (url: string) => void;
}

export default SparkleImage;
