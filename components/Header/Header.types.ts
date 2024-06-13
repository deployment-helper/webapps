import { User } from '@/src/types/types';
import { IProject } from '@/src/types/video.types';

export interface HeaderProps {
  title?: string;
  user?: User;
  projectList?: Array<IProject>;
}
