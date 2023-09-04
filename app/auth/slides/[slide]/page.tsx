export const Page = ({
  params,
  searchParams,
}: {
  params: { slide: string };
  searchParams: { updatedAt: string };
}) => {
  return `PresentationId: ${params.slide}, updatedAt:${searchParams.updatedAt}`;
};

export default Page;
