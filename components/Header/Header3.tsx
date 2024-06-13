import { Avatar, mergeClasses } from '@fluentui/react-components';
import { Navigation24Filled } from '@fluentui/react-icons';

import BaseHeader from '@/components/BaseHeader/BaseHeader';
import { useStyles } from './Header.styles';
import { HeaderProps } from '@/components/Header/Header.types';
import ProjectDropdown from '@/components/ProjectDropdown/ProjectDropdown';
import { useVideoStore } from '@/src/stores/video.store';
import { useRouter } from 'next/navigation';

export const Header3 = ({ projectList }: HeaderProps) => {
  const router = useRouter();

  const classes = useStyles();
  const currentProject = useVideoStore((state) => state.currentProjectId);

  const onProjectSelect = (projectId: string) => {
    router.push(`/auth/projects/${projectId}`);
  };

  return (
    <BaseHeader
      slot1={
        <Navigation24Filled
          className={mergeClasses(classes.title, 'cursor-pointer')}
        />
      }
      slot2={
        <ProjectDropdown
          projects={projectList || []}
          defaultProject={currentProject}
          onProjectSelect={onProjectSelect}
        />
      }
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

export default Header3;
