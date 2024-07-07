import { IInput } from '@/src/types/types';

export interface ILayoutProps {
  sceneId: string;
  isDisplayNone?: boolean;
  content?: Record<string, IInput>;
}
