import { User } from "@/src/types";

export interface HeaderProps {
  title: string;
  user?: User;
  projectList?: string[];
  currentProject?: string;
  type: "public" | "auth" | "create" | "edit";
}
