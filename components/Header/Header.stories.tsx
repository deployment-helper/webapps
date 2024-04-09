import { Meta, StoryObj } from "@storybook/react";
import { Header } from "./Header";
import { type } from "os";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  args: {
    title: "Header title",
    type: "public",
    user: {
      email: "user@example.com",
      image:
        "https://images.unsplash.com/photo-1533636721434-0e2d61030955?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3570&q=80",
      name: "User one",
    },
    projectList: [
      {
        projectName: "Project1",
        id: "p1",
        userId: "u1",
      },
      {
        projectName: "Project2",
        id: "p2",
        userId: "u1",
      },
      {
        projectName: "Project3",
        id: "p3",
        userId: "u1",
      },
    ],
    currentProject: {
      projectName: "Project1",
      id: "p1",
      userId: "u1",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const HeaderPublic: Story = {
  args: {
    type: "public",
  },
};

export const HeaderAuth: Story = {
  args: {
    type: "auth",
  },
};

export const HeaderCreate: Story = {
  args: {
    type: "create",
  },
};
