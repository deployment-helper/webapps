import { IInput } from '@/src/types/types';

export interface ILayoutProps {
  sceneId: string;
  isDisplayNone?: boolean;
  isViewOnly?: boolean;
  content?: Record<string, IInput>;
  parentEl?: HTMLElement | null;
}
