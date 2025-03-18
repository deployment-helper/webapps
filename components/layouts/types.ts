import { IClearError, IError } from '@/src/types/common.types';
import { IInput } from '@/src/types/types';

export interface ILayoutProps {
  content?: Record<string, IInput>;
  isDisplayNone?: boolean;
  isViewOnly?: boolean;
  onClearError?: () => void;
  onError?: (error: string) => void;
  parentEl?: HTMLElement | null;
  sceneId: string;
}
