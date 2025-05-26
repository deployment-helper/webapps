'use client';
import { useCallback, useEffect, useState } from 'react';
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
  MenuButtonProps,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
  SplitButton,
  Subtitle2,
  TableColumnDefinition,
  Title1,
  Tooltip,
} from '@fluentui/react-components';

import {
  getProjectVideoQueryKey,
  useMutationCopyVideo,
  useMutationCreateVideo,
  useMutationDeleteArtifact,
  useMutationDeleteVideo,
  useMutationS3GetSignedUrl,
  useMutationUpdateVideo,
  useQueryGetProject,
  useQueryGetVideosForProject,
} from '@/src/query/video.query';
import { IArtifacts, IVideo } from '@/src/types/video.types';
import { useQueryClient } from '@tanstack/react-query';
import { useMyToastController } from '@/components/MyToast/MyToast.hook';
import {
  CheckmarkCircle24Filled,
  ErrorCircle24Filled,
  MoreVertical20Regular,
  Settings32Filled,
  Warning24Filled,
  ArrowClockwise24Regular,
} from '@fluentui/react-icons';
import { LanguageDialog } from '@/components/LanguageDialog/LanguageDialog';
import { VideoClient } from '@/src/apis/video.client';
import { formatDate, generatePreviewUrl } from '@/src/helpers';
import { FormAddVideo } from '@/components/FormAddVideo';
import { useVideoStore } from '@/src/stores/video.store';
import WorkflowList from '@/components/WorkflowList/WorkflowList';
import ArtifactList from '@/components/ArtifactList/ArtifactList';
import InsertImageModal from '@/components/InsertImageModal/InsertImageModal';
import { useRouter } from 'next/navigation';
import SystemPromptModal from '@/components/SystemPromptModal/SystemPromptModal';

const DOWNLOADS_DESC =
  'This is list of the generated videos. Time format is MM/DD/YY HH:MM';
const ARTIFACTS_DESC = 'This is list of the artifacts.';

function Videos({
  params,
}: {
  params: {
    project_id: string;
  };
}) {
  const router = useRouter();
  const {
    data: videos,
    isFetching,
    isLoading,
  } = useQueryGetVideosForProject(params.project_id);

  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isCrateVideoOpen, setIsCreateVideoOpen] = useState(false);
  const [isWorkFlowOpen, setIsWorkFlowOpen] = useState(false);
  const [isAIAgentModalOpen, setIsAIAgentModalOpen] = useState(false);
  const [artifactsSt, setArtifactsSt] = useState<{
    id: string;
    isOpen: boolean;
    artifacts: IArtifacts[];
    title: string;
    desc: string;
  }>({
    id: '',
    isOpen: false,
    artifacts: [],
    title: '',
    desc: '',
  });
  const [selectedVideo, setSelectedVideo] = useState<IVideo | null>(null);
  const [isThumbNailModelOpen, setIsThumbNailModelOpen] =
    useState<boolean>(false);
  const client = useQueryClient();

  const invalidateProject = () => {
    client.invalidateQueries({
      queryKey: getProjectVideoQueryKey(params.project_id),
    });
  };

  const { mutate: S3GetSignedUrl } = useMutationS3GetSignedUrl();
  const deleteMutation = useMutationDeleteVideo();
  const copyMutation = useMutationCopyVideo();
  const createVideoMutation = useMutationCreateVideo();
  const { mutate: updateVideo } = useMutationUpdateVideo(invalidateProject);

  const { mutate: deleteArtifacts } = useMutationDeleteArtifact(
    (variables: any) => {
      invalidateProject();
      setArtifactsSt({
        ...artifactsSt,
        id: variables.id,
        artifacts: artifactsSt?.artifacts?.filter(
          (_ar) => _ar.s3Key !== variables.s3Key,
        ),
      });
    },
  );

  const setCurrentProject = useVideoStore((state) => state.setCurrentProjectId);

  const { dispatchToast } = useMyToastController();

  const dispatchVideoDownloadToast = () => {
    dispatchToast({
      title: 'Download',
      body: 'Preparing for download. You will be notified once it is ready.',
    });
  };

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
          youtubeUrl: youtubeUrl,
          status: 'published',
        },
      });
    }
  }

  // Upload video thumbnail
  function uploadThumbnail(thumbnailUrl: string) {
    if (!selectedVideo) {
      console.log("Selected video doesn't exist");
      return;
    }
    updateVideo({
      id: selectedVideo.id,
      name: selectedVideo.name,
      data: {
        ...selectedVideo,
        thumbnailUrl: thumbnailUrl,
      },
    });

    dispatchToast({
      title: 'Thumbnail uploaded',
      body: 'Thumbnail has been uploaded successfully',
      intent: 'success',
    });
  }

  function copyVideo(video: IVideo) {
    copyMutation.mutate({
      id: video.id as string,
    });
  }

  // Generate video on batch server
  // TODO: This code block is duplicate and used on multiple places
  // Need to refactor
  function generateVideo(video: IVideo) {
    if (!project?.runnerServerName) {
      console.log('Runner server not found');
      return;
    }
    // Update video status to in_progress
    updateVideo({
      id: video.id as string,
      name: video.name,
      data: {
        ...video,
        status: 'in_progress',
      },
    });

    VideoClient.generateVideoV2(video.id as string, {
      videoId: video.id as string,
      url: generatePreviewUrl(video.id as string, project?.runnerServerName),
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
    if (confirm('Are you sure to delete the video?')) {
      deleteMutation.mutate(video.id);
    }
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

  const refreshVideos = useCallback(() => {
    client.invalidateQueries({
      queryKey: ['project', params.project_id, 'videos'],
    });
  }, [client, params.project_id]);

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
      columnId: 'status',
      renderHeaderCell: () => {
        return <Subtitle2>Status</Subtitle2>;
      },
      renderCell: (item) => {
        let icon = null;
        let statusText = '';
        let iconColor = '';

        switch (item.status) {
          case 'in_progress':
            icon = (
              <div className="flex items-center justify-center rounded-full bg-blue-500 p-0">
                <ArrowClockwise24Regular className="animate-spin text-white" />
              </div>
            );
            statusText = 'In Progress';
            iconColor = 'text-blue-500';
            break;
          case 'published':
            icon = <CheckmarkCircle24Filled />;
            statusText = 'Published';
            iconColor = 'text-green-500';
            break;
          case 'error':
            icon = <ErrorCircle24Filled />;
            statusText = 'Error';
            iconColor = 'text-red-500';
            break;
          default:
            icon = <Warning24Filled />;
            statusText = 'Unknown';
            iconColor = 'text-yellow-500';
        }

        return (
          <Tooltip content={statusText} relationship="label">
            <div className={`flex items-center ${iconColor}`}>{icon}</div>
          </Tooltip>
        );
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
                <a href={item.youtubeUrl} target="_blank">
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
          <Body1Strong
            className={'cursor-pointer underline'}
            onClick={() => {
              setArtifactsSt({
                id: item.id,
                isOpen: true,
                artifacts: item.generatedVideoInfo?.length
                  ? item.generatedVideoInfo?.map<IArtifacts>(
                      (videoInfo, index) => ({
                        name: `${new Date(
                          videoInfo.date as string,
                        ).toLocaleString('en-US', {
                          month: '2-digit',
                          day: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}`,
                        s3Key: videoInfo.cloudFile,
                        dbKey: 'generatedVideoInfo',
                        keyToCompare: 'cloudFile',
                      }),
                    )
                  : [],
                title: 'Downloads',
                desc: DOWNLOADS_DESC,
              });
            }}
          >
            Downloads ({item.generatedVideoInfo.length})
          </Body1Strong>
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
                  <MenuItem
                    onClick={() => {
                      setSelectedVideo(item);
                      setIsThumbNailModelOpen(true);
                    }}
                  >
                    Upload Thumbnail
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      router.push(
                        `/auth/projects/${params.project_id}/video/${item.id}/upload`,
                      );
                    }}
                  >
                    Upload Video
                  </MenuItem>
                  <MenuItem
                    disabled={!item.artifacts?.length}
                    onClick={() =>
                      setArtifactsSt({
                        id: item.id,
                        isOpen: true,
                        artifacts: item.artifacts || [],
                        title: 'Artifacts',
                        desc: ARTIFACTS_DESC,
                      })
                    }
                  >
                    Artifacts
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
  }, [createVideoMutation.isSuccess, refreshVideos]);

  useEffect(() => {
    if (deleteMutation.isSuccess) {
      refreshVideos();
    }
  }, [deleteMutation.isSuccess, refreshVideos]);

  useEffect(() => {
    if (copyMutation.isSuccess) {
      refreshVideos();
    }
  }, [copyMutation.isSuccess, refreshVideos]);

  useEffect(() => {
    setCurrentProject(params.project_id);
  }, [params.project_id, setCurrentProject]);

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
        {isAIAgentModalOpen && (
          <SystemPromptModal
            isOpen={isAIAgentModalOpen}
            onClose={() => setIsAIAgentModalOpen(false)}
            title="Create Video with AI Agent"
            description="Use AI to help create your video. Upload documents or describe what you'd like to include in your video."
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
            <Menu positioning="below-end">
              <MenuTrigger disableButtonEnhancement>
                {(triggerProps: MenuButtonProps) => (
                  <SplitButton
                    appearance="primary"
                    menuButton={triggerProps}
                    primaryActionButton={{
                      onClick: () => setIsCreateVideoOpen(true),
                    }}
                  >
                    Create
                  </SplitButton>
                )}
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={() => setIsWorkFlowOpen(true)}>
                    Create With Workflow
                  </MenuItem>
                  <MenuItem onClick={() => setIsAIAgentModalOpen(true)}>
                    Create With AI Agent
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
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
        {isThumbNailModelOpen && (
          <InsertImageModal
            onUploadSuccess={(url?: string) => {
              if (url) {
                uploadThumbnail(url);
                setIsThumbNailModelOpen(false);
              }
            }}
            isOpen={isThumbNailModelOpen}
            onClose={() => setIsThumbNailModelOpen(false)}
          />
        )}
        {artifactsSt.isOpen && (
          <ArtifactList
            isOpen={true}
            onClose={() => {
              setArtifactsSt({
                id: '',
                isOpen: false,
                artifacts: [],
                title: '',
                desc: '',
              });
            }}
            title={artifactsSt.title}
            desc={artifactsSt.desc}
            artifacts={artifactsSt.artifacts}
            onDownload={(s3Key: string) => {
              dispatchVideoDownloadToast();
              S3GetSignedUrl(s3Key);
            }}
            onRemove={(
              s3Key: string,
              dbKey?: string,
              keyToCompare?: string,
            ) => {
              deleteArtifacts({
                id: artifactsSt.id,
                s3Key,
                dbKey,
                keyToCompare,
              });
            }}
          />
        )}
      </div>
    </>
  );
}

export default Videos;
