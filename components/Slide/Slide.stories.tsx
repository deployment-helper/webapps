import type { Meta, StoryObj } from "@storybook/react";

import { Slide } from "./Slide";
import { SlideProps } from "./slide.types";
import { SlideType } from "@/src/constants";

const meta: Meta<typeof Slide> = {
  title: "component/slide",
  component: Slide,
};

export default meta;

type Story = StoryObj<typeof meta>;
const props: SlideProps = {
  slideType: SlideType.QUESTION,
};

export const Question: Story = {
  render: () => <Slide {...props}></Slide>,
};

export const OptionList: Story = {
  render: () => <Slide {...props} slideType={SlideType.OPTION_LIST}></Slide>,
};

export const Explanation: Story = {
  render: () => <Slide {...props} slideType={SlideType.EXPLANATION}></Slide>,
};
