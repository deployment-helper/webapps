import {
  Avatar,
  Input,
  mergeClasses,
  Spinner,
} from '@fluentui/react-components';
import { ArrowLeft24Filled } from '@fluentui/react-icons';

import BaseHeader from '@/components/BaseHeader/BaseHeader';
import { useStyles } from './Header.styles';
import { HeaderProps } from '@/components/Header/Header.types';
import ProjectDropdown from '@/components/ProjectDropdown/ProjectDropdown';
import { useVideoStore } from '@/src/stores/video.store';
import { useParams, useRouter } from 'next/navigation';
import Language from '@/components/Language/Language';
import { useEffect, useState } from 'react';
import { ELanguage, IProject } from '@/src/types/video.types';
import { debounce } from 'lodash';
import {
  useMutationUpdateVideo,
  useQueryGetVideo,
} from '@/src/query/video.query';
import Link from 'next/link';

let debouncedMutation: any = undefined;

const Slot2 = ({ projectList }: { projectList?: Array<IProject> }) => {
  const router = useRouter();
  const params = useParams();

  const [presentationName, setPresentationName] = useState('');
  const currentProject = useVideoStore((state) => state.currentProjectId);
  const { mutate } = useMutationUpdateVideo();
  const { isLoading, isFetching, data } = useQueryGetVideo(
    params.video_id as string,
  );

  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (debouncedMutation) {
      debouncedMutation.cancel();
    }

    debouncedMutation = debounce(mutate, 1000);

    debouncedMutation({ id: params.video_id, name: e.target.value });
    setPresentationName(e.target.value);
  }

  const onProjectSelect = (projectId: string) => {
    router.push(`/auth/projects/${projectId}`);
  };

  function onLanguageChange(language: ELanguage) {
    mutate({
      id: params.video_id as string,
      name: data?.name || 'UnTitled',
      data: { audioLanguage: language, voiceCode: '' },
    });
  }

  useEffect(() => {
    setPresentationName(data?.name || '');
  }, [data?.name]);

  return (
    <>
      <ProjectDropdown
        readonly={true}
        projects={projectList || []}
        defaultProject={currentProject}
        onProjectSelect={onProjectSelect}
      />
      <Input
        placeholder="Enter name"
        size="medium"
        value={presentationName}
        onChange={onNameChange}
      />
      <Language
        currentLanguage={data?.audioLanguage}
        onSelect={onLanguageChange}
      />
      <Input disabled={true} value={data?.voiceCode || ''} />
      {(isLoading || isFetching) && (
        <div style={{ position: 'relative' }}>
          <Spinner size={'small'} />
        </div>
      )}
    </>
  );
};

export const Header4 = ({ projectList }: HeaderProps) => {
  const classes = useStyles();
  const params = useParams();

  return (
    <BaseHeader
      slot1={
        <Link href={`/auth/projects/${params.project_id}`}>
          <ArrowLeft24Filled
            className={mergeClasses(classes.title, 'cursor-pointer')}
          />
        </Link>
      }
      slot2={<Slot2 projectList={projectList} />}
      slot3={
        <div>
          <Avatar
            className="cursor-pointer"
            image={{
              src: 'https://placekitten.com/32/32',
              as: 'img',
            }}
          />
        </div>
      }
    />
  );
};

export default Header4;
