"use client";
import { FC } from "react";
import Link from "next/link";
import {
  Body1Strong,
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Subtitle2,
  TableColumnDefinition,
  Title1,
  createTableColumn,
  Spinner,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from "@fluentui/react-components";

import {
  useMutationCopyVideo,
  useMutationDeleteVideo,
  useMutationDownloadVideo,
  useQueryGetVideos,
} from "@/src/query/video.query";
import { IVideo } from "@/src/types/video.types";
import { useQueryClient } from "@tanstack/react-query";
import { useMyToastController } from "@/components/MyToast/MyToast.hook";
import { MoreVertical20Regular } from "@fluentui/react-icons";
const Videos: FC = () => {
  const { data: videos, isFetching, isLoading } = useQueryGetVideos();
  const client = useQueryClient();
  const { mutate: downloadVideo } = useMutationDownloadVideo();
  const deleteMutation = useMutationDeleteVideo();
  const copyMutation = useMutationCopyVideo();
  const { dispatchToast } = useMyToastController();
  const dispatchVideoDownloadToast = () => {
    dispatchToast({
      title: "Download Video",
      body: "Preparing video for download. You will be notified once it is ready.",
    });
  };

  function copyVideo(video: IVideo) {
    copyMutation.mutate(video.id);
  }

  function copyAndChangeLanguage(video: IVideo) {
    copyMutation.mutate(video.id);
  }

  function deleteVideo(video: IVideo) {
    deleteMutation.mutate(video.id);
  }

  const columns: TableColumnDefinition<IVideo>[] = [
    createTableColumn<IVideo>({
      columnId: "name",
      renderHeaderCell: () => {
        return <Subtitle2>Name</Subtitle2>;
      },
      renderCell: (item) => {
        return (
          <Link href={`/auth/slides/create-new/${item.id}`}>
            <Body1Strong>{item.name}</Body1Strong>
          </Link>
        );
      },
    }),
    createTableColumn<IVideo>({
      columnId: "download",
      renderHeaderCell: () => {
        return <Subtitle2>Download</Subtitle2>;
      },
      renderCell: (item) => {
        return item.generatedVideoInfo && item.generatedVideoInfo.length ? (
          item.generatedVideoInfo.map((videoInfo) => (
            <Button
              key={videoInfo.cloudFile}
              onClick={() => {
                dispatchVideoDownloadToast();
                downloadVideo(videoInfo.cloudFile);
              }}
            >
              Download
            </Button>
          ))
        ) : (
          <Body1Strong>Not Available</Body1Strong>
        );
      },
    }),
    createTableColumn<IVideo>({
      columnId: "Preview",
      renderHeaderCell: () => {
        return <Subtitle2>Preview</Subtitle2>;
      },
      renderCell: (item) => {
        return (
          <Link target={"_blank"} href={`/auth/videos/${item.id}`}>
            <Body1Strong>Preview</Body1Strong>
          </Link>
        );
      },
    }),
    createTableColumn<IVideo>({
      columnId: "actions",
      renderHeaderCell: () => {
        return <Subtitle2></Subtitle2>;
      },
      renderCell: (item) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Menu positioning="below-start">
              <MenuTrigger>
                <Button icon={<MoreVertical20Regular />} />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={() => copyVideo(item)}>Copy</MenuItem>
                  <MenuItem onClick={() => copyAndChangeLanguage(item)}>
                    Copy and Change Language
                  </MenuItem>
                  <MenuItem onClick={() => deleteVideo(item)}>Delete</MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        );
      },
    }),
  ];

  return (
    <>
      <div className="w-100 max-w-7xl" style={{ minWidth: "80rem" }}>
        <div className="flex justify-between pb-6 pt-6">
          <div className={"flex items-center"}>
            <Title1>Videos</Title1>{" "}
            {(isFetching || isLoading) && (
              <Spinner size={"tiny"} className={"pl-1"} />
            )}
          </div>

          <div className="flex gap-2">
            <Button
              appearance="outline"
              onClick={() => {
                client.invalidateQueries({
                  queryKey: ["videos"],
                });
              }}
            >
              Refresh
            </Button>
            <Button appearance="primary">
              <Link href={"/auth/slides/create-new"}>Create</Link>
            </Button>
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
      </div>
    </>
  );
};

export default Videos;
