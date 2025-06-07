'use client';
import { FC, useState } from 'react';
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
  useMutationCreateProject,
  useMutationUpdateProject,
  useQueryGetProjects,
} from '@/src/query/video.query';
import { IProject, IVideo } from '@/src/types/video.types';
import { useQueryClient } from '@tanstack/react-query';
import FormAddProject from '../../../components/FormAddProject/FormAddProject';
import { formatDate } from '@/src/helpers';
import { MoreVertical20Regular } from '@fluentui/react-icons';

const Projects: FC = () => {
  const { data: projects, isFetching, isLoading } = useQueryGetProjects();
  const client = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [currentProject, setCurrentProject] =
    useState<Partial<IProject> | null>(null);
  const addProjectMutation = useMutationCreateProject();
  const updateProjectMutation = useMutationUpdateProject();

  const columns: TableColumnDefinition<IProject>[] = [
    createTableColumn<IProject>({
      columnId: 'name',
      renderHeaderCell: () => {
        return <Subtitle2>Name</Subtitle2>;
      },
      renderCell: (item) => {
        return (
          <Link href={`/auth/projects/${item.id}`}>
            <Body1Strong>{item.projectName}</Body1Strong>
          </Link>
        );
      },
    }),
    createTableColumn<IProject>({
      columnId: 'description',
      renderHeaderCell: () => {
        return <Subtitle2>Description</Subtitle2>;
      },
      renderCell: (item) => {
        return <Body1Strong>{item.projectDesc}</Body1Strong>;
      },
    }),
    createTableColumn<IProject>({
      columnId: 'Date',
      renderHeaderCell: () => {
        return <Subtitle2>Date</Subtitle2>;
      },
      renderCell: (item) => {
        return <Body1Strong>{formatDate(item.createdAt._seconds)}</Body1Strong>;
      },
    }),
    createTableColumn<IProject>({
      columnId: 'actions',
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
                  <MenuItem
                    onClick={() => {
                      console.log(item);
                      setCurrentProject(item);
                      setIsOpen(true);
                    }}
                  >
                    Update
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        );
      },
      renderHeaderCell: () => {
        return <Subtitle2></Subtitle2>;
      },
    }),
  ];

  const onFormSubmit = (data: {
    projectName: string;
    projectDescription: string;
  }) => {
    if (currentProject?.id) {
      updateProjectMutation.mutate({ ...currentProject, ...data });
    } else {
      addProjectMutation.mutate(data);
    }

    setIsOpen(false);
  };

  return (
    <>
      <div className="w-100 max-w-7xl" style={{ minWidth: '80rem' }}>
        <div className="flex justify-between pb-6 pt-6">
          <div className={'flex items-center'}>
            <Title1>Projects</Title1>{' '}
            {(isFetching || isLoading) && (
              <Spinner size={'tiny'} className={'pl-1'} />
            )}
          </div>

          <div className="flex gap-2">
            <Button
              appearance="outline"
              onClick={() => {
                client.invalidateQueries({
                  queryKey: ['projects'],
                });
              }}
            >
              Refresh
            </Button>
            <Button
              appearance={'primary'}
              onClick={() => {
                setCurrentProject(null);
                setIsOpen(true);
              }}
            >
              Add Project
            </Button>
          </div>
        </div>
        {projects && projects.length && (
          <DataGrid className="w-100 flex" items={projects} columns={columns}>
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
      {isOpen && (
        <FormAddProject
          formTitle={currentProject?.id ? 'Update Project' : 'Add Project'}
          name={currentProject?.projectName}
          description={currentProject?.projectDesc}
          isOpen={true}
          onClose={() => {
            setIsOpen(false);
          }}
          onSubmit={onFormSubmit}
        />
      )}
    </>
  );
};

export default Projects;
