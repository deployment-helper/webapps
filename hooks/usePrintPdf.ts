export const usePrintPdf = (): boolean => {
  return new URLSearchParams(window.location.search).has('print-pdf');
};

export default usePrintPdf;
