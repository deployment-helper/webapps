import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Layout6 from '@/components/layouts/Layout6';
import { ILayoutProps } from '@/components/layouts/types';

export default {
  title: 'Layouts/Layout6',
  component: Layout6,
  argTypes: {
    content: { control: 'object' },
    sceneId: { control: 'text' },
    isDisplayNone: { control: 'boolean' },
    isViewOnly: { control: 'boolean' },
  },
} as Meta<typeof Layout6>;

const Template: StoryFn<typeof Layout6> = (args: ILayoutProps) => (
  <Layout6 {...args} />
);

export const Default = Template.bind({});
Default.args = {
  content: {
    video: {
      value:
        'https://vm-presentations.s3.ap-south-1.amazonaws.com/public/86ae16fa-c65a-46cf-acf1-aba592299aac.mp4',
    },
    title: { value: 'Sample Title' },
  },
  sceneId: 'scene1',
  isDisplayNone: false,
  isViewOnly: false,
};

export const ViewOnly = Template.bind({});
ViewOnly.args = {
  ...Default.args,
  isViewOnly: true,
};

export const Hidden = Template.bind({});
Hidden.args = {
  ...Default.args,
  isDisplayNone: true,
};
