import React from 'react';
import { Body1, Button } from '@fluentui/react-components';

import DrawerHOC from '@/components/DrawerHOC/DrawerHOC';
import List from '@/components/List/List';
import { ListItem } from '@/components/ListItem/Listitem';
import { IArtifacts } from '@/src/types/video.types';

interface ArtifactListProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  desc: string;
  artifacts: IArtifacts[];
  onDownload: (s3Key: string) => void;
  onRemove: (s3Key: string, dbKey?: string, propertyToCompare?: string) => void;
}

const ArtifactList: React.FC<ArtifactListProps> = ({
  isOpen,
  onClose,
  title,
  desc,
  artifacts,
  onDownload,
  onRemove,
}) => {
  return (
    <DrawerHOC isOpen={isOpen} onClose={onClose} title={title}>
      <>
        <Body1>{desc}</Body1>
        <List>
          {artifacts.map((artifact, index) => (
            <ListItem key={artifact.s3Key}>
              <div className="flex w-full items-center justify-between">
                <span>{artifact.name}</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => onDownload(artifact.s3Key)}
                    appearance="primary"
                  >
                    Download
                  </Button>
                  <Button
                    onClick={() =>
                      onRemove(
                        artifact.s3Key,
                        artifact.dbKey,
                        artifact.keyToCompare,
                      )
                    }
                    appearance="secondary"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </ListItem>
          ))}
        </List>
      </>
    </DrawerHOC>
  );
};

export default ArtifactList;
