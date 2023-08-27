import { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  args: {
    title: "Title",
  },
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const SidebarDefult: Story = {};
