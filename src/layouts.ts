import { IInput } from '@/src/types/types';

/**
 * Do not change layout orders and ids as database already do have data with these ids
 */
const layouts: Array<{
  id: string;
  componentName: string;
  image: string;
  content: Record<string, IInput>;
}> = [
  {
    id: 'layout1',
    componentName: 'TitleSubtitle',
    image: '/layout1.png',
    content: {
      title: {
        type: 'input',
        name: 'title',
        value: 'Title',
        placeholder: 'Title',
      },
      subtitle: {
        type: 'input',
        name: 'subtitle',
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
        value: 'Title',
        placeholder: 'Title',
      },
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
export const DEFAULT_LAYOUT = layouts[1];
export default layouts;
