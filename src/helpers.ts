import { v4 as uuid } from "uuid";

import { Presentation } from "./types";

export const addSlideIds = (presentation: Presentation) => {
  for (const slide of presentation.slides) {
    slide.id = uuid();
  }

  return presentation;
};

const defaultExport = {
  addSlideIds,
};

export default defaultExport;
