import React from 'react';
import { Button } from '@fluentui/react-components';

import DrawerHOC from '@/components/DrawerHOC/DrawerHOC';
import List from '@/components/List/List';
import { ListItem } from '@/components/ListItem/Listitem';

interface ArtifactListProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  artifacts: string[];
  onDownload: (id: string) => void;
  onRemove: (id: string) => void;
}

const ArtifactList: React.FC<ArtifactListProps> = ({
  isOpen,
  onClose,
  title,
  artifacts,
  onDownload,
  onRemove,
}) => {
  return (
    <DrawerHOC isOpen={isOpen} onClose={onClose} title={title}>
      <List>
        {artifacts.map((artifact, index) => (
          <ListItem key={artifact}>
            <div className="flex w-full items-center justify-between">
              <span>{index + 1}</span>
              <div className="flex gap-2">
                <Button
                  onClick={() => onDownload(artifact)}
                  appearance="primary"
                >
                  Download
                </Button>
                <Button
                  onClick={() => onRemove(artifact)}
                  appearance="secondary"
                >
                  Remove
                </Button>
              </div>
            </div>
          </ListItem>
        ))}
      </List>
    </DrawerHOC>
  );
};

export default ArtifactList;
