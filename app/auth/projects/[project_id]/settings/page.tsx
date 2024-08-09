'use client';

import {
  useMutationUpdateProject,
  useQueryGetProject,
  useQueryGetProjects,
} from '@/src/query/video.query';
import { Button, Title1 } from '@fluentui/react-components';
import List from '@/components/List/List';
import { ListItem } from '@/components/ListItem';
import { Group24Filled, GroupFilled } from '@fluentui/react-icons';
import InsertImageModal from '@/components/InsertImageModal/InsertImageModal';
import { useState } from 'react';
import { getFileType } from '@/src/helpers';
import Image from '@/components/Image/Image';
import { Video } from '@/components/Video/Video';

function Page({
  params,
}: {
  params: {
    project_id: string;
  };
}) {
  const { data } = useQueryGetProject(params.project_id);
  const { mutate } = useMutationUpdateProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const updateProject = (url: string) => {
    const assets: string[] = data?.assets?.length ? data.assets : [];
    assets.push(url);

    mutate({
      ...data,
      id: params.project_id,
      assets: assets,
    });
  };

  const deleteAsset = (url: string) => {
    const assets: string[] = data?.assets?.length ? data.assets : [];
    const index = assets.indexOf(url);
    if (index > -1) {
      assets.splice(index, 1);
    }
    mutate({
      ...data,
      id: params.project_id,
      assets: assets,
    });
  };

  return (
    <div className={'w-100 flex w-full max-w-7xl flex-col'}>
      <div className={'flex  justify-start pb-1 pt-1'}>
        <Title1> {data?.projectName}</Title1>
      </div>

      <div className="flex flex-row">
        <div className="w-1/4">
          <List>
            <ListItem>
              <Group24Filled />
              Assets
            </ListItem>
            <ListItem>Voices</ListItem>
            <ListItem>Background music</ListItem>
          </List>
        </div>
        <div className="flex w-3/4 flex-col">
          <div className={'flex justify-end border-b-2 border-b-gray-200 pb-2'}>
            <Button appearance={'primary'} onClick={() => setIsModalOpen(true)}>
              Upload Assets
            </Button>
          </div>
          <div className={'flex flex-row flex-wrap gap-1'}>
            {data?.assets?.map((asset: string, index: number) => {
              const fileType = getFileType(asset);
              if (fileType.type === 'image') {
                return (
                  <div key={asset} className={'max-w-md'}>
                    <Image
                      onDelete={() => deleteAsset(asset)}
                      isViewOnly={true}
                      key={index}
                      src={asset}
                    />
                  </div>
                );
              } else if (fileType.type === 'video') {
                return (
                  <div key={asset} className={'max-w-md'}>
                    <Video
                      onDelete={() => deleteAsset(asset)}
                      isViewOnly={true}
                      key={index}
                      src={asset}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={asset} className={'max-w-md'}>
                    <Image
                      onDelete={() => deleteAsset(asset)}
                      isViewOnly={true}
                      key={index}
                      src={asset}
                    />
                  </div>
                );
              }
            })}
          </div>
          {isModalOpen && (
            <InsertImageModal
              isOpen={isModalOpen}
              onUploadSuccess={(url?: string) => {
                console.log('onUploadSuccess');
                console.log(`url =${url}`);
                url && updateProject(url);
                setIsModalOpen(false);
              }}
              title={'Upload Asset'}
              isDisplayURLUpload={false}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
