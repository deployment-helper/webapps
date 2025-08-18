import type { Meta, StoryObj } from '@storybook/react';
import { UserDropdown } from './UserDropdown';

// Mock the store for storybook
const meta: Meta<typeof UserDropdown> = {
  title: 'Components/UserDropdown',
  component: UserDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};