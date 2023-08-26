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
  questionEn: "THis is a english question",
  questionHi: "This is a Hindi question",
  options: [
    {
      en: "This is option A",
      hi: "This is option hindi A",
    },
    {
      en: "This is option B",
      hi: "This is option hindi B",
    },
    {
      en: "This is option C",
      hi: "This is option hindi C",
    },
    {
      en: "This is option D",
      hi: "This is option hindi D",
      isRight: true,
    },
  ],
  rightAnswer: {
    en: "This is option D",
    hi: "This is option hindi D",
  },
  explanationEn:
    "THis is the explantion of the slide question.. why provided answer is right",
};

export const Question: Story = {
  render: () => <Slide {...props}></Slide>,
};

export const OptionList: Story = {
  render: () => <Slide {...props} slideType={SlideType.OPTION_LIST}></Slide>,
};

export const RightAnswer: Story = {
  render: () => <Slide {...props} slideType={SlideType.RIGHT_ANSWER}></Slide>,
};

export const Explanation: Story = {
  render: () => <Slide {...props} slideType={SlideType.EXPLANATION}></Slide>,
};
