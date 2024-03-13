"use client";
import { FC, useEffect } from "react";
import Link from "next/link";
import useSlidesStore from "@/src/stores/store";
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
} from "@fluentui/react-components";
import { IPresentation } from "@/src/types/types";
import { CheckmarkCircle20Filled, Open24Filled } from "@fluentui/react-icons";
import { ServerClient } from "@/src/apis/server-client";
import { formatDateString } from "@/src/helpers";

const Slides: FC = () => {
  const { listPresentations, getS3PublicUrl } = useSlidesStore();
  const currentProject = useSlidesStore((store) => store.currentProject);
  const presentations = useSlidesStore((store) => store.presentations);
  const apiServer = useSlidesStore((store) => store.apiServer);
  const batchApiServer = useSlidesStore((store) => store.batchApiServer);
  const s3PublicUrls = useSlidesStore((store) => store.s3PublicUrls);

  const refreshList = () => {
    if (currentProject) {
      listPresentations(currentProject?.projectId);
    }
  };

  const generateAudio = (presentation: IPresentation) => {
    ServerClient.generateAudio(apiServer as string, presentation);
  };
  const generateVideo = (presentation: IPresentation) => {
    ServerClient.generateVideo(
      batchApiServer as string,
      presentation,
      `${location.protocol}//${location.host}/auth/slides/${presentation.project.projectId}?updatedAt=${presentation.updatedAt}`,
    );
  };

  const columns: TableColumnDefinition<IPresentation>[] = [
    createTableColumn<IPresentation>({
      columnId: "name",
      renderHeaderCell: () => {
        return <Subtitle2>Name</Subtitle2>;
      },
      renderCell: (item) => {
        return <Body1Strong>{item.name}</Body1Strong>;
      },
    }),
    createTableColumn<IPresentation>({
      columnId: "createdAt",
      renderHeaderCell: () => {
        return <Subtitle2>Created At</Subtitle2>;
      },
      renderCell: (item) => {
        return formatDateString(item.createdAt);
      },
    }),
    createTableColumn<IPresentation>({
      columnId: "Audio",
      renderHeaderCell: () => {
        return <Subtitle2>Audio</Subtitle2>;
      },
      renderCell: (item) => {
        return item.isAudioGenerated ? (
          <CheckmarkCircle20Filled className="text-green-800" />
        ) : (
          <Button
            appearance="outline"
            onClick={() => {
              generateAudio(item);
            }}
          >
            Generate
          </Button>
        );
      },
    }),
    createTableColumn<IPresentation>({
      columnId: "Video",
      renderHeaderCell: () => {
        return <Subtitle2>Video</Subtitle2>;
      },
      renderCell: (item) => {
        return item.isVideoGenerated ? (
          <CheckmarkCircle20Filled className="text-green-800" />
        ) : (
          <Button
            disabled={!item.isAudioGenerated}
            appearance="outline"
            onClick={() => {
              generateVideo(item);
            }}
          >
            Generate
          </Button>
        );
      },
    }),
    createTableColumn<IPresentation>({
      columnId: "Download",
      renderHeaderCell: () => {
        return <Subtitle2>Video</Subtitle2>;
      },
      renderCell: (item) => {
        const url = item.s3VideoFile && s3PublicUrls?.[item.s3VideoFile];
        return url ? (
          <Link target="_blank" href={url}>
            Download file
          </Link>
        ) : (
          <Button
            disabled={!item.isVideoGenerated}
            appearance="outline"
            onClick={() => {
              getS3PublicUrl(item.s3VideoFile as string);
            }}
          >
            Download
          </Button>
        );
      },
    }),
    createTableColumn<IPresentation>({
      columnId: "link",
      renderHeaderCell: () => {
        return <Subtitle2>Link</Subtitle2>;
      },
      renderCell: (item) => {
        return (
          <Button disabled={!item.isAudioGenerated}>
            <Link
              href={`/auth/slides/${item.project.projectId}?updatedAt=${item.updatedAt}`}
              target="_blank"
            >
              <Body1Strong>Link</Body1Strong>
              <Open24Filled className="ml-2" />
            </Link>
          </Button>
        );
      },
    }),
  ];

  useEffect(() => {
    if (currentProject && !presentations?.length) {
      listPresentations(currentProject?.projectId);
    }
  }, [currentProject, listPresentations, presentations?.length]);

  return (
    <>
      <div className="w-100 max-w-7xl" style={{ minWidth: "80rem" }}>
        <div className="flex justify-between pb-6 pt-6">
          <Title1>Presentation List</Title1>
          <div className="flex gap-2">
            <Button appearance="outline" onClick={refreshList}>
              Refresh
            </Button>
            <Button appearance="primary">
              <Link href={"/auth/slides/create"}>Create</Link>
            </Button>
          </div>
        </div>
        {presentations && presentations.length && (
          <DataGrid
            className="w-100 flex"
            items={presentations}
            columns={columns}
          >
            <DataGridHeader>
              <DataGridRow>
                {({ renderHeaderCell }) => (
                  <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                )}
              </DataGridRow>
            </DataGridHeader>
            <DataGridBody<IPresentation>>
              {({ item, rowId }) => (
                <DataGridRow<IPresentation> key={rowId}>
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

export default Slides;
