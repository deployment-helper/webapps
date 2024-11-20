import { IProject } from '@/src/types/video.types';
import { FC, useState } from 'react';
import { getFileType } from '@/src/helpers';
import Image from '@/components/Image/Image';
import { Video } from '@/components/Video/Video';
import List from '@/components/List/List';
import { ListItem } from '@/components/ListItem';

export const ProjectAssets: FC<IProjectAssetsProps> = ({
  assets,
  assetSize = 'medium',
  onAssetSelect,
}) => {
  // TODO: Needs to more make this component more generic so this can be used in project settings page.
  const width =
    assetSize === 'small' ? 200 : assetSize === 'medium' ? 300 : 400;
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  return (
    <List listDir={'row'}>
      {assets?.map((asset: string, index: number) => {
        const fileType = getFileType(asset);
        return (
          <ListItem
            key={asset}
            onClick={() => {
              setSelectedAsset(asset);
              onAssetSelect && onAssetSelect(asset);
            }}
            selected={selectedAsset === asset}
          >
            {fileType.type === 'image' ? (
              <div style={{ width: width }}>
                <Image isViewOnly={true} key={index} src={asset} />
              </div>
            ) : fileType.type === 'video' ? (
              <div style={{ width: width }}>
                <Video
                  copyPosition={'bottom-right'}
                  isViewOnly={true}
                  key={index}
                  src={asset}
                />
              </div>
            ) : (
              <div style={{ width: width }}>
                <Image
                  copyPosition={'bottom-right'}
                  isViewOnly={true}
                  key={index}
                  src={asset}
                />
              </div>
            )}
          </ListItem>
        );
      })}
    </List>
  );
};

export interface IProjectAssetsProps {
  assets: IProject['assets'];
  assetSize?: 'small' | 'medium' | 'large';
  onAssetSelect?: (asset: string) => void;
}

export default ProjectAssets;
