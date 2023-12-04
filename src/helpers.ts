import { v4 as uuid } from "uuid";

import { Presentation } from "./types";

export const addSlideIds = (presentation: Presentation) => {
  for (const slide of presentation.slides) {
    slide.id = uuid();
  }

  return presentation;
};

export  function formatDateString(dateString:string) {
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

const defaultExport = {
  addSlideIds,
  formatDateString
};

export default defaultExport;
