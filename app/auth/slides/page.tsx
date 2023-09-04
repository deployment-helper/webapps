"use client";
import { FC, useEffect } from "react";
import Link from "next/link";
import useSlidesStore from "../../../src/store";
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  TableColumnDefinition,
  createTableColumn,
} from "@fluentui/react-components";
import { IPresentation } from "@/src/types";

export const Slides: FC = () => {
  const { listPresentations } = useSlidesStore();
  const currentProject = useSlidesStore((store) => store.currentProject);
  const presentations = useSlidesStore((store) => store.presentations);

  const columns: TableColumnDefinition<IPresentation>[] = [
    createTableColumn<IPresentation>({
      columnId: "project",
      renderHeaderCell: () => {
        return "Project";
      },
      renderCell: (item) => {
        return item.project.projectName;
      },
    }),
    createTableColumn<IPresentation>({
      columnId: "name",
      renderHeaderCell: () => {
        return "Name";
      },
      renderCell: (item) => {
        return item.name;
      },
    }),
    createTableColumn<IPresentation>({
      columnId: "User",
      renderHeaderCell: () => {
        return "user";
      },
      renderCell: (item) => {
        return item.user.email;
      },
    }),
    createTableColumn<IPresentation>({
      columnId: "s3File",
      renderHeaderCell: () => {
        return "S3 File";
      },
      renderCell: (item) => {
        return item.s3File;
      },
    }),
    createTableColumn<IPresentation>({
      columnId: "s3MetaFile",
      renderHeaderCell: () => {
        return "S3 Meta File";
      },
      renderCell: (item) => {
        return item.s3MetaFile;
      },
    }),
    createTableColumn<IPresentation>({
      columnId: "updatedAt",
      renderHeaderCell: () => {
        return "Updated At";
      },
      renderCell: (item) => {
        return item.updatedAt;
      },
    }),
    createTableColumn<IPresentation>({
      columnId: "createdAt",
      renderHeaderCell: () => {
        return "Created At";
      },
      renderCell: (item) => {
        return item.createdAt;
      },
    }),
  ];
  useEffect(() => {
    if (currentProject && !presentations?.length) {
      listPresentations(currentProject?.projectId);
    }
  }, [currentProject]);

  return (
    <>
      <Link href={"/auth/slides/create"}>Create Slide</Link>
      <div className="w-100 max-w-7xl">
        {presentations && presentations.length && (
          <DataGrid items={presentations} columns={columns}>
            <DataGridHeader>
              <DataGridRow selectionCell={{ "aria-label": "Select all rows" }}>
                {({ renderHeaderCell }) => (
                  <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                )}
              </DataGridRow>
            </DataGridHeader>
            <DataGridBody<IPresentation>>
              {({ item, rowId }) => (
                <DataGridRow<IPresentation>
                  key={rowId}
                  selectionCell={{ "aria-label": "Select row" }}
                >
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
