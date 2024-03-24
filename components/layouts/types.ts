import { IInput } from "@/src/types/types";

export interface ILayoutProps {
  sceneId: string;
  isNone?: boolean;
  content?: Record<string, IInput>;
}
