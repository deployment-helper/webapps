import { IInput } from '@/src/types/types';
import { getRandomValueFromArray, getVideosFromAssets } from '@/src/helpers';

/**
 * Do not change layout orders and ids as database already do have data with these ids
 */
// TODO: Add name and description to layouts to show in the UI
// TODO: layout should have add default asset behaviour to add default asset to the layout
type TLayout = {
  id: string;
  desc?: string;
  componentName: string;
  image: string;
  content: Record<string, IInput>;
  addDefaultAsset?: <T extends Partial<TLayout>>(
    layout: T,
    assets: string[],
    content?: Record<string, any>,
  ) => T;
};

export const layouts: Array<TLayout> = [
  {
    id: 'layout1',
    componentName: 'TitleSubtitle',
    image: '/layout1.png',
    content: {
      title: {
        type: 'input',
        name: 'title',
        bodyCopyType: 'title',
        value: 'Title',
        placeholder: 'Title',
      },
      subtitle: {
        type: 'input',
        name: 'subtitle',
        bodyCopyType: 'subtitle',
        value: 'Subtitle',
        placeholder: 'Subtitle',
      },
    },
  },
  {
    id: 'layout2',
    desc: 'Image layout',
    componentName: 'LayoutImage',
    image: '/layout2.png',
    content: {
      image: {
        type: 'image',
        name: 'image',
        value: '/no-image.png',
        placeholder: 'Image',
      },
    },
  },
  {
    id: 'layout3',
    componentName: 'Title',
    image: '/layout3.png',
    content: {
      title: {
        type: 'input',
        name: 'title',
        bodyCopyType: 'title',
        value: 'Title',
        placeholder: 'Title',
      },
    },
  },
  {
    id: 'layout4',
    componentName: 'LayoutVideo',
    image: '/layout4.png',
    content: {
      video: {
        type: 'video',
        name: 'video',
        value: '/layout4.png',
        placeholder: 'video',
      },
    },
    addDefaultAsset: function (layout, assets: string[]) {
      const _videoAssets = getVideosFromAssets(assets);
      const video = getRandomValueFromArray(_videoAssets);
      // TODO: needs to check why this is undefined, currently passing this as argument
      if (layout.content) {
        layout.content.video.value = video;
      }
      layout.image = video;
      return layout;
    },
  },
  {
    id: 'layout5',
    desc: 'Image + title',
    componentName: 'Layout5',
    image: '/layout5.png',
    content: {
      image: {
        type: 'image',
        name: 'image',
        value: '/layout5.png',
        placeholder: 'video',
      },
      title: {
        type: 'input',
        name: 'title',
        bodyCopyType: 'title',
        value: 'Title',
        placeholder: 'Title',
      },
    },
  },
  {
    id: 'layout6',
    componentName: 'Layout6',
    image: '/layout6.png',
    content: {
      video: {
        type: 'video',
        name: 'video',
        value: '/layout6.png',
        placeholder: 'video',
      },
      title: {
        type: 'input',
        name: 'title',
        bodyCopyType: 'title',
        value: 'Title',
        placeholder: 'Title',
      },
    },
    addDefaultAsset: function (
      layout,
      assets: string[],
      content?: Record<string, any>,
    ) {
      const _videoAssets = getVideosFromAssets(assets);
      const video = getRandomValueFromArray(_videoAssets);
      // TODO: needs to check why this is undefined, currently passing this as argument
      if (layout.content) layout.content.video.value = video;
      layout.image = video;
      //   Add title if passed
      if (content?.desc && layout.content) {
        layout.content.title.value = content.desc;
      }
      return layout;
    },
  },
  {
    id: 'layout7',
    componentName: 'Layout7',
    image: '/layout7.png',
    content: {
      image: {
        type: 'image',
        name: 'image',
        value: '/layout7.png',
        placeholder: 'image',
      },
    },
  },
  {
    id: 'layout8',
    desc: 'Question with options layout',
    componentName: 'HeaderOptions',
    image: '/layout8.png',
    content: {
      question: {
        type: 'input',
        name: 'question',
        bodyCopyType: 'title',
        value: 'What is your question?',
        placeholder: 'Enter your question',
      },
      options: {
        type: 'input',
        name: 'options',
        bodyCopyType: 'subtitle',
        value:
          '[{"text": "Option 1", "isCorrect": true}, {"text": "Option 2", "isCorrect": false}]',
        placeholder: 'Add JSON array of options with isCorrect flag',
      },
      isShowAnswer: {
        type: 'input',
        name: 'isShowAnswer',
        value: 'false',
        placeholder: 'true/false',
      },
    },
  },
  {
    id: 'layout9',
    desc: 'Question answer explanation layout',
    componentName: 'HeaderAnswerExplanation',
    image: '/layout8.png', // Using layout8 image temporarily, should be updated with proper image
    content: {
      question: {
        type: 'input',
        name: 'question',
        bodyCopyType: 'title',
        value: 'What is your question?',
        placeholder: 'Enter your question',
      },
      correctAnswer: {
        type: 'input',
        name: 'correctAnswer',
        bodyCopyType: 'subtitle',
        value: 'The correct answer',
        placeholder: 'Enter the correct answer',
      },
      explanation: {
        type: 'input',
        name: 'explanation',
        bodyCopyType: 'body',
        value: 'Explanation for the correct answer',
        placeholder: 'Enter explanation for why this is correct',
      },
    },
  },
];

export const ALLOWED_LAYOUTS = [
  'layout2',
  'layout3',
  'layout4',
  'layout5',
  'layout6',
  'layout8',
  'layout9', // Adding layout9 to allowed layouts
];

export const LAYOUT_IDS = layouts.map((layout: TLayout) => layout.id);

export const DEFAULT_LAYOUT = layouts[1];
export default layouts;
