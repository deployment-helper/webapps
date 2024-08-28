import { IInput } from '@/src/types/types';
import { getRandomValueFromArray, getVideosFromAssets } from '@/src/helpers';

/**
 * Do not change layout orders and ids as database already do have data with these ids
 */
// TODO: Add name and description to layouts to show in the UI
// TODO: layout should have add default asset behaviour to add default asset to the layout
type TLayout = {
  id: string;
  componentName: string;
  image: string;
  content: Record<string, IInput>;
  addDefaultAsset?: (
    layout: TLayout,
    assets: string[],
    content?: Record<string, any>,
  ) => TLayout;
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
    componentName: 'LayoutImage',
    image: '/layout2.png',
    content: {
      image: {
        type: 'image',
        name: 'image',
        value: 'https://via.placeholder.com/150',
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
      layout.content.video.value = video;
      layout.image = video;
      return layout;
    },
  },
  {
    id: 'layout5',
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
      layout: TLayout,
      assets: string[],
      content?: Record<string, any>,
    ) {
      const _videoAssets = getVideosFromAssets(assets);
      const video = getRandomValueFromArray(_videoAssets);
      // TODO: needs to check why this is undefined, currently passing this as argument
      layout.content.video.value = video;
      layout.image = video;
      //   Add title if passed
      if (content?.desc) {
        layout.content.title.value = content.desc;
      }
      return layout;
    },
  },
];

export const ALLOWED_LAYOUTS = [
  'layout1',
  'layout2',
  'layout4',
  'layout5',
  'layout6',
];

export const LAYOUT_IDS = layouts.map((layout: TLayout) => layout.id);

export const DEFAULT_LAYOUT = layouts[1];
export default layouts;
