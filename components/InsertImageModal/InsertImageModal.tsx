import InsertImage, {
  IInsertImageProps,
} from '@/components/InsertImage/InsertImage';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Subtitle1,
} from '@fluentui/react-components';
import { DialogOpenChangeEventHandler } from '@fluentui/react-dialog';
import { UploadStatus } from '@/src/types/common.types';
import { useState } from 'react';
import { DismissCircle24Filled } from '@fluentui/react-icons';
import {
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
} from '@fluentui/react-tabs';
import { useVideoStore } from '@/src/stores/video.store';
import { useQueryGetProject } from '@/src/query/video.query';
import ProjectAssets from '../ProjectAssets/ProjectAssets';

export function InsertImageModal({
  onUploadSuccess,
  onOpenChange,
  onClose,
  title,
  isOpen = false,
  isDisplayURLUpload = true,
}: IInsertImageModalProps) {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [selectedTab, setSelectedTab] = useState<string>('desktop');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const onUploadStatusChange = (status: UploadStatus) => {
    setUploadStatus(status);
  };
  const projectId = useVideoStore((state) => state.currentProjectId);
  const { data: projectData } = useQueryGetProject(projectId as string);
  const TAB_DESKTOP = 'desktop';
  const TAB_PROJECT = 'project';

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab((data.value as string) || TAB_DESKTOP);
  };

  const onAssetSelect = (asset: string) => {
    setSelectedAsset(asset);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>
            <div className={'flex justify-between'}>
              <TabList
                size={'small'}
                defaultSelectedValue={selectedTab}
                onTabSelect={onTabSelect}
              >
                <Tab value={TAB_DESKTOP}>
                  <Subtitle1>{title ? title : 'Select From Desktop'}</Subtitle1>
                </Tab>
                <Tab value={TAB_PROJECT}>
                  <Subtitle1>Select Project Asset</Subtitle1>
                </Tab>
              </TabList>
              <div
                className={
                  'relative -right-4 -top-4 cursor-pointer text-gray-600'
                }
                onClick={onClose}
              >
                <DismissCircle24Filled />
              </div>
            </div>
          </DialogTitle>
          <DialogContent className={'block'} style={{ height: '350px' }}>
            {selectedTab === TAB_PROJECT ? (
              <div>
                <ProjectAssets
                  assets={projectData?.assets || []}
                  assetSize={'small'}
                  onAssetSelect={onAssetSelect}
                />
              </div>
            ) : (
              <InsertImage
                onUploadSuccess={onUploadSuccess}
                onStateChange={onUploadStatusChange}
                isDisplayURLUpload={isDisplayURLUpload}
              />
            )}
          </DialogContent>
          <DialogActions>
            {selectedTab === TAB_PROJECT && (
              <Button
                disabled={selectedAsset === null || selectedAsset === undefined}
                appearance={'primary'}
                onClick={() => {
                  selectedAsset && onUploadSuccess(selectedAsset);
                  onClose && onClose();
                }}
              >
                Apply
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export interface IInsertImageModalProps extends IInsertImageProps {
  onOpenChange?: DialogOpenChangeEventHandler;
  onClose?: () => void;
  isOpen?: boolean;
  title?: string;
}

export default InsertImageModal;
