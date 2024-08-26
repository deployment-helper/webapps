import { v4 as uuid } from 'uuid';

import { Presentation } from './types/types';
import { layouts } from '@/src/layouts';

export const addSlideIds = (presentation: Presentation) => {
  for (const slide of presentation.slides) {
    slide.id = uuid();
  }

  return presentation;
};

export function formatDateString(dateString: string) {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Extract components of the date
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format components to ensure two digits
  const formattedMonth = month.toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  // Construct formatted date string
  return `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}`;
}

export function s3RandomPublicKey() {
  return `public/${uuid()}`;
}

export function getApiServer() {
  const apiServer = document.querySelector("[data-store='apiServer']")
    ?.textContent;

  if (!apiServer) {
    throw new Error('apiServer not found');
  }

  return apiServer;
}

export function getBatchServer() {
  const batchServer = document.querySelector("[data-store='batchApiServer']")
    ?.textContent;

  if (!batchServer) {
    throw new Error('batchServer not found');
  }

  return batchServer;
}

// Generate current web app frontend server URL with scheme and port
export function getFrontendServerUrl() {
  return `${window.location.protocol}//${window.location.host}`;
}

export function getLayout(
  currentLayoutId: string,
  addRandomAssets = false,
  assets?: string[],
) {
  const layout = layouts.find((layout) => layout.id === currentLayoutId);
  if (addRandomAssets && layout?.addDefaultAsset && assets) {
    layout.addDefaultAsset.call(layout, assets);
  }
  return layout;
}

/**
 * Read apiKey params from query string and add to the provided URL
 */
export function checkAndSetApiKey(url: string) {
  const pageUrl = document.location.href;
  const urlObj = new URL(pageUrl);
  const apiKey = urlObj.searchParams.get('apiKey');

  if (apiKey) {
    const urlObj = new URL(url);
    urlObj.searchParams.set('key', apiKey);
    return urlObj.toString();
  }

  return url;
}

export function generatePreviewUrl(videoId: string, apiServer?: boolean) {
  //http://localhost:3000/auth/videos/ZbUNPeasPcPtOIG7o64z
  const server = apiServer
    ? 'http://apis.app-management.com' // This is just a dummy value for server use in the backend
    : getFrontendServerUrl();
  return `${server}/auth/videos/${videoId}`;
}

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero based
  const year = date.getFullYear();

  // Pad the day and month with a zero if they are single digit
  const dayStr = day < 10 ? '0' + day : day;
  const monthStr = month < 10 ? '0' + month : month;

  return dayStr + '-' + monthStr + '-' + year;
};

export const getFileType = (
  file: File | string,
): {
  extension: string;
  type: 'image' | 'video' | 'audio' | 'application' | 'text' | 'other';
} => {
  const extension =
    typeof file === 'string'
      ? file.split('.').pop() || ''
      : file.name.split('.').pop() || '';
  const imageTypes = ['jpeg', 'png', 'gif', 'bmp', 'webp'];
  const videoTypes = ['mp4', 'webm', 'ogg', 'mov'];
  const audioTypes = ['mp3', 'wav', 'ogg'];
  const textTypes = ['pdf', 'txt'];
  const applicationTypes = ['json', 'xml', 'csv', 'zip'];

  if (imageTypes.includes(extension)) {
    return {
      extension,
      type: 'image',
    };
  } else if (videoTypes.includes(extension)) {
    return {
      extension,
      type: 'video',
    };
  } else if (audioTypes.includes(extension)) {
    return {
      extension,
      type: 'audio',
    };
  } else if (textTypes.includes(extension)) {
    return {
      extension,
      type: 'text',
    };
  } else if (applicationTypes.includes(extension)) {
    return {
      extension,
      type: 'application',
    };
  } else {
    return {
      extension,
      type: 'other',
    };
  }
};
const defaultExport = {
  addSlideIds,
  s3RandomPublicKey,
  formatDateString,
  formatDate,
  getFileType,
};

export function getVideosFromAssets(assets: string[]) {
  return assets.filter((asset) => getFileType(asset).type === 'video');
}

export function getImagesFromAssets(assets: string[]) {
  return assets.filter((asset) => getFileType(asset).type === 'image');
}

export function getRandomValueFromArray(array: string[]) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export default defaultExport;
