import { mergeClasses } from '@fluentui/react-components';
import { Navigation24Filled } from '@fluentui/react-icons';

import BaseHeader from '@/components/BaseHeader/BaseHeader';
import { useStyles } from './Header.styles';
import { HeaderProps } from '@/components/Header/Header.types';
import ProjectDropdown from '@/components/ProjectDropdown/ProjectDropdown';
import { useVideoStore } from '@/src/stores/video.store';
import { useRouter } from 'next/navigation';
import UserDropdown from '@/components/UserDropdown';

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
          <UserDropdown />
        </div>
      }
    />
  );
};

export default Header3;
