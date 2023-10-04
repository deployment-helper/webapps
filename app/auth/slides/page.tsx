"use client";
import { FC, useEffect } from "react";
import Link from "next/link";
import useSlidesStore from "@/src/store";
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
import { IPresentation } from "@/src/types";
import { CheckmarkCircle20Filled, Open24Filled } from "@fluentui/react-icons";
import { ServerClient } from "@/src/server-client";

const Slides: FC = () => {
  const { listPresentations } = useSlidesStore();
  const currentProject = useSlidesStore((store) => store.currentProject);
  const presentations = useSlidesStore((store) => store.presentations);
  const apiServer = useSlidesStore((store) => store.apiServer);

  const refreshList = () => {
    if (currentProject) {
      listPresentations(currentProject?.projectId);
    }
  };

  const generateAudio = (presentation: IPresentation) => {
    ServerClient.generateAudio(apiServer as string, presentation);
  };

  const columns: TableColumnDefinition<IPresentation>[] = [
    createTableColumn<IPresentation>({
      columnId: "project",
      renderHeaderCell: () => {
        return <Subtitle2>Project</Subtitle2>;
      },
      renderCell: (item) => {
        return item.project.projectName;
      },
    }),
    createTableColumn<IPresentation>({
      columnId: "name",
      renderHeaderCell: () => {
        return <Subtitle2>Name</Subtitle2>;
      },
      renderCell: (item) => {
        return item.name;
      },
    }),
    createTableColumn<IPresentation>({
      columnId: "User",
      renderHeaderCell: () => {
        return <Subtitle2>User</Subtitle2>;
      },
      renderCell: (item) => {
        return item.user.email;
      },
    }),
    createTableColumn<IPresentation>({
      columnId: "createdAt",
      renderHeaderCell: () => {
        return <Subtitle2>Created At</Subtitle2>;
      },
      renderCell: (item) => {
        return item.createdAt;
      },
    }),
    createTableColumn<IPresentation>({
      columnId: "Auido",
      renderHeaderCell: () => {
        return <Subtitle2>Auido</Subtitle2>;
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
      columnId: "Duration",
      renderHeaderCell: () => {
        return <Subtitle2>Duration</Subtitle2>;
      },
      renderCell: (item) => {
        return "TODO";
      },
    }),
    createTableColumn<IPresentation>({
      columnId: "link",
      renderHeaderCell: () => {
        return <Subtitle2>Link</Subtitle2>;
      },
      renderCell: (item) => {
        return (
          <Button>
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
