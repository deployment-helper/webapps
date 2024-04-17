import { ELanguage } from "@/src/types/video.types";

export enum Theme {
  BLUE = "BLUE",
  YELLOW = "YELLOW",
}

export enum SlideType {
  QUESTION = "QUESTION",
  OPTION_LIST = "OPTION_LIST",
  RIGHT_ANSWER = "RIGHT_ANSWER",
  EXPLANATION = "EXPLANATION",
}

export const TOASTER_ID = "defaultToaster";

export const DEFAULT_THEME = Theme.BLUE;

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE", // You can add more methods as needed
}

export const SUPPORTED_LANGUAGES: Record<
  string,
  { label: string; value: ELanguage }
> = {
  ...Object.entries(ELanguage).reduce(
    (acc, [key, value]) => {
      acc[key] = { label: key, value: value as ELanguage };
      return acc;
    },
    {} as Record<string, { label: string; value: ELanguage }>,
  ),
};
