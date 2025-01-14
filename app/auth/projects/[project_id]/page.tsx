'use client';
import { ElementType, FC, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Body1Strong,
  Button,
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
  Subtitle2,
  TableColumnDefinition,
  Title1,
} from '@fluentui/react-components';

import {
  getProjectVideoQueryKey,
  useMutationCopyVideo,
  useMutationCreateVideo,
  useMutationDeleteVideo,
  useMutationDownloadVideo,
  useMutationUpdateVideo,
  useQueryGetProject,
  useQueryGetVideosForProject,
} from '@/src/query/video.query';
import { IVideo } from '@/src/types/video.types';
import { useQueryClient } from '@tanstack/react-query';
import { useMyToastController } from '@/components/MyToast/MyToast.hook';
import {
  CheckmarkCircle24Filled,
  MoreVertical20Regular,
  Settings32Filled,
} from '@fluentui/react-icons';
import { LanguageDialog } from '@/components/Dialog/Dialog';
import { VideoClient } from '@/src/apis/video.client';
import { formatDate, generatePreviewUrl } from '@/src/helpers';
import { FormAddVideo } from '@/components/FormAddVideo';
import { useVideoStore } from '@/src/stores/video.store';
import WorkflowList from '@/components/WorkflowList/WorkflowList';

function Videos({
  params,
}: {
  params: {
    project_id: string;
  };
}) {
  const {
    data: videos,
    isFetching,
    isLoading,
  } = useQueryGetVideosForProject(params.project_id);
  const client = useQueryClient();
  const { mutate: downloadVideo } = useMutationDownloadVideo();
  const deleteMutation = useMutationDeleteVideo();
  const copyMutation = useMutationCopyVideo();
  const createVideoMutation = useMutationCreateVideo();
  const { mutate: updateVideo } = useMutationUpdateVideo(() => {
    client.invalidateQueries({
      queryKey: getProjectVideoQueryKey(params.project_id),
    });
  });

  const setCurrentProject = useVideoStore((state) => state.setCurrentProjectId);

  const { dispatchToast } = useMyToastController();

  const dispatchVideoDownloadToast = () => {
    dispatchToast({
      title: 'Download Video',
      body: 'Preparing video for download. You will be notified once it is ready.',
    });
  };

  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isCrateVideoOpen, setIsCreateVideoOpen] = useState(false);
  const [isWorkFlowOpen, setIsWorkFlowOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<IVideo | null>(null);

  const { data: project } = useQueryGetProject(params.project_id);

  function publishVideo(video: IVideo) {
    if (video) {
      let youtubeUrl = prompt('Enter youtube url of the published video');

      // Ensure that youtube url is provided
      if (youtubeUrl === null || youtubeUrl === '') return;

      updateVideo({
        id: video.id,
        name: video.name,
        data: {
          ...video,
          isPublished: true,
          youtubeUrl: youtubeUrl
        },
      });
    }
  }
  function copyVideo(video: IVideo) {
    copyMutation.mutate({
      id: video.id as string,
    });
  }

  // Generate video on batch server
  function generateVideo(video: IVideo) {
    VideoClient.generateVideoV2(video.id as string, {
      videoId: video.id as string,
      url: generatePreviewUrl(video.id as string, true),
    });
    dispatchToast({
      title: 'Video is being created',
      body: 'You will be notified once the video is ready for download.',
      intent: 'success',
    });
  }

  function onClose() {
    setIsLanguageDropdownOpen(false);
    setSelectedVideo(null);
  }

  function copyWithNewLanguage(language: string) {
    setIsLanguageDropdownOpen(false);
    copyMutation.mutate({
      id: selectedVideo?.id as string,
      langFrom: selectedVideo?.audioLanguage,
      langTo: language,
    });

    setSelectedVideo(null);
  }

  function copyAndChangeLanguage(video: IVideo) {
    setIsLanguageDropdownOpen(true);
    setSelectedVideo(video);
  }

  function deleteVideo(video: IVideo) {
    deleteMutation.mutate(video.id);
  }

  function createNewVideo(data: Partial<IVideo>) {
    if (project?.videoWithDefaultSettings) {
      data = {
        ...data,
        audioLanguage: project?.defaultLanguage,
        voiceCode: project?.defaultVoice,
        backgroundMusic: project?.defaultBackgroundMusic,
        overlay: project?.defaultOverlay,
      };
    }
    createVideoMutation.mutate(data);
    setIsCreateVideoOpen(false);
  }

  function refreshVideos() {
    client.invalidateQueries({
      queryKey: ['project', params.project_id, 'videos'],
    });
  }

  const columns: TableColumnDefinition<IVideo>[] = [
    createTableColumn<IVideo>({
      columnId: 'id',
      renderHeaderCell: () => {
        return <Subtitle2>ID</Subtitle2>;
      },
      renderCell: (item) => {
        return <Body1Strong>{item.id}</Body1Strong>;
      },
    }),
    createTableColumn<IVideo>({
      columnId: 'Published',
      renderHeaderCell: () => {
        return <Subtitle2>Published</Subtitle2>;
      },
      renderCell: (item) => {
        return (
          <div className={'pl-4'}>
            {item.isPublished && (
              <>
                <a href={item.youtubeUrl} target='_blank'>
                  Video Link
                </a>
                <CheckmarkCircle24Filled className={'text-green-700'} />
              </>
            )}
          </div>
        );
      },
    }),
    createTableColumn<IVideo>({
      columnId: 'name',
      renderHeaderCell: () => {
        return <Subtitle2>Name</Subtitle2>;
      },
      renderCell: (item) => {
        return (
          <Link href={`/auth/projects/${params.project_id}/video/${item.id}`}>
            <Body1Strong className={'underline'}>{item.name}</Body1Strong>
          </Link>
        );
      },
    }),
    createTableColumn<IVideo>({
      columnId: 'download',
      renderHeaderCell: () => {
        return <Subtitle2>Download</Subtitle2>;
      },
      renderCell: (item) => {
        return item.generatedVideoInfo && item.generatedVideoInfo.length ? (
          item.generatedVideoInfo.map((videoInfo, index) => (
            // TODO: Download UX needs to be improved.
            <Button
              key={videoInfo.cloudFile}
              onClick={() => {
                dispatchVideoDownloadToast();
                downloadVideo(videoInfo.cloudFile);
              }}
              size={'small'}
            >
              {index + 1}
            </Button>
          ))
        ) : (
          <Body1Strong>Not Available</Body1Strong>
        );
      },
    }),
    createTableColumn<IVideo>({
      columnId: 'Date',
      renderHeaderCell: () => {
        return <Subtitle2>Date</Subtitle2>;
      },
      renderCell: (item) => {
        return <Body1Strong>{formatDate(item.createdAt._seconds)}</Body1Strong>;
      },
    }),
    createTableColumn<IVideo>({
      columnId: 'Preview',
      renderHeaderCell: () => {
        return <Subtitle2>Preview</Subtitle2>;
      },
      renderCell: (item) => {
        return (
          <Link target={'_blank'} href={`/auth/videos/${item.id}`}>
            <Body1Strong className={'underline'}>Preview</Body1Strong>
          </Link>
        );
      },
    }),
    createTableColumn<IVideo>({
      columnId: 'actions',
      renderHeaderCell: () => {
        return <Subtitle2></Subtitle2>;
      },
      renderCell: (item) => {
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <Menu positioning="below-start">
              <MenuTrigger>
                <Button icon={<MoreVertical20Regular />} />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={() => generateVideo(item)}>
                    Generate Video
                  </MenuItem>
                  <MenuItem onClick={() => copyVideo(item)}>Copy</MenuItem>
                  <MenuItem onClick={() => copyAndChangeLanguage(item)}>
                    Copy and Change Language
                  </MenuItem>
                  {/*TODO: add confirm to delete the video*/}
                  <MenuItem onClick={() => deleteVideo(item)}>Delete</MenuItem>
                  <MenuItem onClick={() => publishVideo(item)}>
                    Mark Published
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        );
      },
    }),
  ];

  useEffect(() => {
    if (createVideoMutation.isSuccess) {
      refreshVideos();
    }
  }, [createVideoMutation.isSuccess]);

  useEffect(() => {
    if (deleteMutation.isSuccess) {
      refreshVideos();
    }
  }, [deleteMutation.isSuccess]);

  useEffect(() => {
    if (copyMutation.isSuccess) {
      refreshVideos();
    }
  }, [copyMutation.isSuccess]);

  useEffect(() => {
    setCurrentProject(params.project_id);
  }, [params.project_id]);

  return (
    <>
      <div className="w-100 max-w-7xl" style={{ minWidth: '80rem' }}>
        {isLanguageDropdownOpen && (
          <LanguageDialog
            open={isLanguageDropdownOpen}
            onClose={onClose}
            onSubmit={copyWithNewLanguage}
          />
        )}
        <div className="flex justify-between pb-6 pt-6">
          <div className={'flex items-center'}>
            <Title1>{project?.projectName}</Title1>{' '}
            {(isFetching || isLoading) && (
              <Spinner size={'tiny'} className={'pl-1'} />
            )}
          </div>

          <div className="flex items-center gap-2 align-middle">
            <Button
              appearance="outline"
              onClick={() => {
                refreshVideos();
              }}
            >
              Refresh
            </Button>
            <Button
              appearance="primary"
              onClick={() => {
                setIsCreateVideoOpen(true);
              }}
            >
              Create
            </Button>
            <Button
              appearance="primary"
              onClick={() => {
                setIsWorkFlowOpen(true);
              }}
            >
              Create With Workflow
            </Button>
            <Link
              className={'rounded-md p-2 hover:bg-gray-100'}
              href={`/auth/projects/${params.project_id}/settings`}
            >
              <Settings32Filled />
            </Link>
          </div>
        </div>
        {videos && videos.length && (
          <DataGrid className="w-100 flex" items={videos} columns={columns}>
            <DataGridHeader>
              <DataGridRow>
                {({ renderHeaderCell }) => (
                  <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                )}
              </DataGridRow>
            </DataGridHeader>
            <DataGridBody<IVideo>>
              {({ item, rowId }) => (
                <DataGridRow<IVideo> key={rowId}>
                  {({ renderCell }) => (
                    <DataGridCell>{renderCell(item)}</DataGridCell>
                  )}
                </DataGridRow>
              )}
            </DataGridBody>
          </DataGrid>
        )}
        {isCrateVideoOpen && (
          <FormAddVideo
            isOpen={isCrateVideoOpen}
            onClose={() => {
              setIsCreateVideoOpen(false);
            }}
            onSubmit={createNewVideo}
            projectId={params.project_id}
            projectName={project?.projectName}
          />
        )}
        {isWorkFlowOpen && (
          <WorkflowList
            isOpen={isWorkFlowOpen}
            projectID={params.project_id}
            onClose={() => setIsWorkFlowOpen(false)}
            prompts={project?.prompts}
          />
        )}
      </div>
    </>
  );
}

export default Videos;
