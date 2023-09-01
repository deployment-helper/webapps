import { User, IProject } from "@/src/types";

export interface HeaderProps {
  title: string;
  user?: User;
  projectList?: Array<IProject>;
  currentProject?: IProject;
  type: "public" | "auth" | "create" | "edit";
}
