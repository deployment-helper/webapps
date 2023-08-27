export interface SidebarProps {
  title: string;
  plusActions?: Array<{ title: string; href: string }>;
  items?: Array<{
    title: string;
    options?: Array<{ title: string; href: string }>;
  }>;
}
