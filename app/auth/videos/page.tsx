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
} from "@fluentui/react-components";

import { useQueryGetVideos } from "@/src/query/video.query";
import { IVideo } from "@/src/types/video.types";
import { useQueryClient } from "@tanstack/react-query";
const Videos: FC = () => {
  const { data: videos, isFetching, isLoading } = useQueryGetVideos();
  const client = useQueryClient();

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
