import React, { useEffect, useRef, useState } from 'react';
import {
  Body1Stronger,
  Button,
  Spinner,
  Textarea,
} from '@fluentui/react-components';
import DrawerHOC from '@/components/DrawerHOC/DrawerHOC';
import List from '@/components/List/List';
import { ListItem } from '@/components/ListItem';
import Image from '@/components/Image/Image';
import { useVideoStore } from '@/src/stores/video.store';
import { useMutationGetSceneImages } from '@/src/query/video.query';
import { ArrowClockwise32Filled } from '@fluentui/react-icons';

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
  const [visualDesc, setVisualDesc] = useState<string>('');
  const textArea = useRef<HTMLTextAreaElement>(null);

  const desc = useVideoStore((state) => state.sceneDesc);

  const { mutate: getImages, data, isPending } = useMutationGetSceneImages();

  const handleApply = () => {
    if (selectedImage) {
      onApply(selectedImage);
    }
  };

  // Get images based on description
  useEffect(() => {
    if (desc) {
      getImages({ sceneDesc: desc, visualDesc: '' });
    }
  }, [desc]);

  useEffect(() => {
    if (Array.isArray(data?.links)) {
      setImages(data?.links || []);
    }
    if (data?.visualDesc) {
      setVisualDesc(data?.visualDesc);
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
        {isPending ? (
          ''
        ) : (
          <>
            <Body1Stronger>Visual Prompt</Body1Stronger>
            <div className={'flex w-full items-center gap-3'}>
              <Textarea
                ref={textArea}
                cols={50}
                rows={2}
                value={visualDesc}
                defaultValue={visualDesc}
                onChange={() => {
                  setVisualDesc((textArea.current as any).value);
                }}
              ></Textarea>
              <Button
                appearance={'primary'}
                size={'small'}
                onClick={() => {
                  const _visualDesc = (textArea.current as any).value;
                  getImages({ sceneDesc: desc || '', visualDesc: _visualDesc });
                  setVisualDesc(_visualDesc);
                  setImages([]);
                }}
              >
                <ArrowClockwise32Filled className={'text-white'} />
              </Button>
            </div>
          </>
        )}
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
                  selectedImage === image ? ' border-8 border-violet-200' : ''
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
