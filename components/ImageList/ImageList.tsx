import React, { useEffect, useState } from 'react';
import { Body1, Spinner } from '@fluentui/react-components';
import DrawerHOC from '@/components/DrawerHOC/DrawerHOC';
import List from '@/components/List/List';
import { ListItem } from '@/components/ListItem';
import Image from '@/components/Image/Image';
import { useVideoStore } from '@/src/stores/video.store';
import { useMutationGetSceneImages } from '@/src/query/video.query';

interface ImageListProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onApply: (url: string) => void;
}

const ImageList: React.FC<ImageListProps> = ({
  isOpen,
  onClose,
  title,
  onApply,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const desc = useVideoStore((state) => state.sceneDesc);
  const { mutate: getImages, data, isPending } = useMutationGetSceneImages();

  const handleApply = () => {
    if (selectedImage) {
      onApply(selectedImage);
    }
  };

  useEffect(() => {
    if (desc) {
      getImages(desc);
    }
  }, [desc]);
  useEffect(() => {
    if (Array.isArray(data)) {
      setImages(data);
    }
  }, [data]);

  return (
    <DrawerHOC
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onSubmit={handleApply}
    >
      <>
        <Body1>{desc}</Body1>
        {isPending ? (
          <div className="flex h-full items-center justify-center">
            <Spinner label="Loading images..." />
          </div>
        ) : (
          <List listDir={'row'}>
            {images.map((image, index) => (
              <ListItem
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`cursor-pointer ${
                  selectedImage === image ? ' border-2 border-violet-200' : ''
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <Image src={image} alt={`Image ${index}`} isViewOnly />
                </div>
              </ListItem>
            ))}
          </List>
        )}
      </>
    </DrawerHOC>
  );
};

export default ImageList;
